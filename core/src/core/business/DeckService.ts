import { inject, injectable } from "inversify";
import { DeckPart } from "../model/DeckPart";
import { Card } from "../model/Card";
import { DECKPARTS } from "../data/DeckParts";
import { Deck } from "../model/Deck";
import { TYPES } from "../../types";
import { CardService } from "./CardService";
import { Format } from "../model/Format";

@injectable()
class DeckService {
    private readonly cardService: CardService;

    constructor(@inject(TYPES.CardService) cardService: CardService) {
        this.cardService = cardService;
    }

    public canAdd(
        deck: Deck,
        deckPart: DeckPart,
        format: Format,
        card: Card
    ): boolean {
        if (!deckPart.allowsCard(card)) {
            return false;
        }

        const deckPartSize = deck.parts.get(deckPart)!.length;
        if (deckPartSize + 1 > deckPart.max) {
            return false;
        }

        const count = this.getAllCards(deck).filter(existingCard =>
            this.cardService.isTreatedAsSame(existingCard, card)
        ).length;
        return count < card.banlist[format];
    }

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
