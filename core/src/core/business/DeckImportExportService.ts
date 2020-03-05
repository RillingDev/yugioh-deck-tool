import { inject, injectable } from "inversify";
import { Deck } from "../model/Deck";
import { TYPES } from "../../types";
import { CardDatabase } from "./CardDatabase";
import { Card } from "../model/Card";
import { DECKPARTS } from "../data/DeckParts";
import { DeckPart } from "../model/DeckPart";

interface ImportResult {
    deck: Deck;
    missing: string[];
}

interface DeckFile {
    fileName: string;
    fileContent: string;
}

@injectable()
class DeckImportExportService {
    @inject(TYPES.CardDatabase) private readonly cardDatabase: CardDatabase;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase
    ) {
        this.cardDatabase = cardDatabase;
    }

    public fromFile(deckFile: DeckFile): ImportResult {
        const parts = new Map<DeckPart, Card[]>();
        for (const deckPart of DECKPARTS) {
            parts.set(deckPart, []);
        }
        const missing: string[] = [];

        const lines = deckFile.fileContent
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);
        let currentDeckPart = null;
        for (const line of lines) {
            const foundDeckPart = DECKPARTS.find(
                part => part.indicator === line
            );
            if (foundDeckPart != null) {
                currentDeckPart = foundDeckPart;
                continue;
            }

            // Only start processing once a deckpart indicator was found. this allows for arbitrary file metadata as "head" of the file.
            if (currentDeckPart != null) {
                if (!this.cardDatabase.hasCard(line)) {
                    missing.push(line);
                } else {
                    const card = this.cardDatabase.getCard(line)!;
                    parts.get(currentDeckPart)!.push(card);
                }
            }
        }

        return {
            deck: { name: deckFile.fileName.replace(".ydk", ""), parts },
            missing
        };
    }

    public toFile(deck: Deck): DeckFile {
        const fileLines: string[] = [];

        for (const deckPart of DECKPARTS) {
            const deckPartCards = deck.parts.get(deckPart)!;
            fileLines.push(deckPart.indicator);
            fileLines.push(...deckPartCards.map(card => card.id));
            fileLines.push("");
        }

        return {
            fileName: `${deck.name}.ydk`,
            fileContent: fileLines.join("\n")
        };
    }
}

export { DeckImportExportService };
