import { injectable } from "inversify";
import { DeckPart } from "../model/DeckPart";
import { Card } from "../model/Card";
import { DECKPARTS } from "../data/DeckParts";
import { Deck } from "../model/Deck";

@injectable()
class DeckService {
    public getAllCards(deck: Deck): Card[] {
        const result = [];
        for (const deckPart of DECKPARTS) {
            result.push(...deck.parts.get(deckPart)!);
        }
        return result;
    }

    public createEmptyDeck(): Deck {
        const parts = new Map<DeckPart, Card[]>();
        for (const deckPart of DECKPARTS) {
            parts.set(deckPart, []);
        }
        return { name: null, parts };
    }
}

export { DeckService };
