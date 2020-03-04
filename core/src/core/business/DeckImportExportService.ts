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

@injectable()
class DeckImportExportService {
    @inject(TYPES.CardDatabase) private readonly cardDatabase: CardDatabase;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase
    ) {
        this.cardDatabase = cardDatabase;
    }

    public fromFile(fileContent: string, fileName: string): ImportResult {
        const parts = new Map<DeckPart, Card[]>();
        for (const deckpart of DECKPARTS) {
            parts.set(deckpart, []);
        }
        const missing: string[] = [];

        const lines = fileContent
            .trim()
            .split("\n")
            .map(str => str.trim());

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

        const name = fileName.replace(".ydk", "");
        return { deck: { name, parts }, missing };
    }
}

export { DeckImportExportService };
