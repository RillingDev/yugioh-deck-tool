import { inject, injectable } from "inversify";
import { Deck } from "../model/Deck";
import { TYPES } from "../../types";
import { CardDatabase } from "./CardDatabase";
import { Card } from "../model/Card";
import { DeckPartsArray } from "../data/DeckParts";
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
        const missing: string[] = [];

        const lines = fileContent
            .trim()
            .split("\n")
            .map(str => str.trim());

        let currentDeckPart = null;
        let currentCards: Card[] = [];
        for (const line of lines) {
            const startingDeckPart = DeckPartsArray.find(
                part => part.indicator === line
            );
            if (startingDeckPart != null) {
                currentDeckPart = startingDeckPart;
                currentCards = [];
                if (!parts.has(currentDeckPart)) {
                    parts.set(currentDeckPart, currentCards);
                }
                continue;
            }

            if (currentDeckPart != null) {
                if (this.cardDatabase.hasCard(line)) {
                    currentCards.push(this.cardDatabase.getCard(line)!);
                } else {
                    missing.push(line);
                }
            }
        }

        const name = fileName.replace(".ydk", "");
        return { deck: { name, parts }, missing };
    }
}

export { DeckImportExportService };
