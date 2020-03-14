import { inject, injectable } from "inversify";
import { DeckPart, DEFAULT_DECK_PART_ARR } from "../model/ygo/DeckPart";
import { Card } from "../model/ygo/Card";
import { Deck } from "../model/ygo/Deck";
import { TYPES } from "../../types";
import { CardService } from "./CardService";
import { Format } from "../model/ygo/Format";
import { removeItem } from "lightdash";
import { clone } from "lodash";
import { SortingService, SortingStrategy } from "./SortingService";

@injectable()
class DeckService {
    private readonly cardService: CardService;
    private readonly sortingService: SortingService;

    constructor(
        @inject(TYPES.CardService) cardService: CardService,
        @inject(TYPES.SortingService) sortingService: SortingService
    ) {
        this.cardService = cardService;
        this.sortingService = sortingService;
    }

    public canAdd(
        deck: Deck,
        deckPart: DeckPart,
        format: Format,
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
        const banState = this.cardService.getBanStateByFormat(card, format);
        return count < banState.count;
    }

    public addCard(deck: Deck, deckPart: DeckPart, card: Card): Deck {
        const deckClone = this.cloneDeck(deck);
        deckClone.parts.get(deckPart)!.push(card);
        return deckClone;
    }

    public removeCard(deck: Deck, deckPart: DeckPart, card: Card): Deck {
        const deckClone = this.cloneDeck(deck);
        deckClone.parts.set(
            deckPart,
            Array.from(removeItem<Card>(deck.parts.get(deckPart)!, card, false))
        );
        return deckClone;
    }

    public sort(deck: Deck): Deck {
        const deckClone = this.cloneDeck(deck);
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            deckClone.parts.set(
                deckPart,
                this.sortingService.sort(
                    deckClone.parts.get(deckPart)!,
                    SortingStrategy.DECK
                )
            );
        }
        return deckClone;
    }

    public shuffle(deck: Deck): Deck {
        const deckClone = this.cloneDeck(deck);
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            deckClone.parts.set(
                deckPart,
                this.sortingService.sort(
                    deckClone.parts.get(deckPart)!,
                    SortingStrategy.SHUFFLE
                )
            );
        }
        return deckClone;
    }

    public getAllCards(deck: Deck): Card[] {
        const result = [];
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            result.push(...deck.parts.get(deckPart)!);
        }
        return result;
    }

    public createEmptyDeck(): Deck {
        const parts = new Map<DeckPart, Card[]>();
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            parts.set(deckPart, []);
        }
        return { name: null, parts };
    }

    private cloneDeck(deck: Deck): Deck {
        const deckClone = clone(deck);
        deckClone.parts = new Map<DeckPart, Card[]>(deckClone.parts);
        return deckClone;
    }
}

export { DeckService };
