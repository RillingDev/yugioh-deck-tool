import { inject, injectable } from "inversify";
import { Deck } from "../model/Deck";
import { TYPES } from "../../types";
import { CardDatabase } from "./CardDatabase";
import { Card } from "../model/Card";
import { DECKPARTS } from "../data/DeckParts";
import { DeckPart } from "../model/DeckPart";
import { CompressionService } from "./CompressionService";

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
    private readonly cardDatabase: CardDatabase;
    private readonly compressionService: CompressionService;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase,
        @inject(TYPES.CompressionService)
        compressionService: CompressionService
    ) {
        this.compressionService = compressionService;
        this.cardDatabase = cardDatabase;
    }

    public fromFile(deckFile: DeckFile): ImportResult {
        const parts = this.createPartMap();
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

    public fromLegacyUrlQueryParamValue(
        val: string,
        base64Decoder: (val: string) => string
    ): Deck {
        const parts = this.createPartMap();
        const uncompressedValue = this.compressionService.inflateString(
            base64Decoder(val)
        );

        const DELIMITERS = {
            deckPart: "|",
            cardId: ";",
            cardAmount: "*"
        };

        uncompressedValue
            .split(DELIMITERS.deckPart)
            .forEach((deckPartList: string, index) => {
                const deckPart = DECKPARTS[index];
                const deckPartCards = parts.get(deckPart)!;

                if (deckPartList.length > 0) {
                    deckPartList.split(DELIMITERS.cardId).forEach(entry => {
                        let count = 1;
                        let cardId = entry;
                        if (entry.startsWith(DELIMITERS.cardAmount)) {
                            count = Number(entry[1]);
                            cardId = entry.slice(2);
                        }

                        if (!this.cardDatabase.hasCard(cardId)) {
                            throw new TypeError(
                                "Unknown card, this hopefully should never happen"
                            );
                        }
                        const card = this.cardDatabase.getCard(cardId)!;

                        for (let i = 0; i < count; i++) {
                            deckPartCards.push(card);
                        }
                    });
                }
            });

        return { name: null, parts };
    }

    private createPartMap(): Map<DeckPart, Card[]> {
        const parts = new Map<DeckPart, Card[]>();
        for (const deckPart of DECKPARTS) {
            parts.set(deckPart, []);
        }
        return parts;
    }
}

export { DeckImportExportService };
