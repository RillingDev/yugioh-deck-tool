import { inject, injectable } from "inversify";
import { DeckPart } from "../model/DeckPart";
import { Card } from "../model/Card";
import { DEFAULT_DECKPART_ARR } from "../model/DefaultDeckPart";
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
        format: Format.TCG | Format.OCG | Format.GOAT,
        card: Card
    ): boolean {
        if (!card.type.deckPart.has(deckPart)) {
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
        for (const deckPart of DEFAULT_DECKPART_ARR) {
            result.push(...deck.parts.get(deckPart)!);
        }
        return result;
    }

    public createEmptyDeck(): Deck {
        const parts = new Map<DeckPart, Card[]>();
        for (const deckPart of DEFAULT_DECKPART_ARR) {
            parts.set(deckPart, []);
        }
        return { name: null, parts };
    }
}

export { DeckService };
