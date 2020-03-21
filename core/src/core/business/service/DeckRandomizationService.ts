import { inject, injectable } from "inversify";
import { CardFilter, FilterService } from "./FilterService";
import { Deck } from "../../model/ygo/Deck";
import { CardDatabase } from "../CardDatabase";
import { DeckService } from "./DeckService";
import { TYPES } from "../../../types";
import { DeckPart, DEFAULT_DECK_PART_ARR } from "../../model/ygo/DeckPart";
import { SortingService } from "./SortingService";
import { CardService } from "./CardService";
import { min } from "lodash";
import { Card } from "../../model/ygo/Card";
import { Format } from "../../model/ygo/Format";

enum RandomizationStrategy {
    NORMAL,
    ARCHETYPE_1,
    ARCHETYPE_2,
    ARCHETYPE_3,
    HIGHLANDER
}

@injectable()
class DeckRandomizationService {
    private readonly cardDatabase: CardDatabase;
    private readonly deckService: DeckService;
    private readonly filterService: FilterService;
    private readonly sortingService: SortingService;
    private readonly cardService: CardService;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase,
        @inject(TYPES.DeckService)
        deckService: DeckService,
        @inject(TYPES.FilterService)
        filterService: FilterService,
        @inject(TYPES.SortingService)
        sortingService: SortingService,
        @inject(TYPES.CardService)
        cardService: CardService
    ) {
        this.deckService = deckService;
        this.cardDatabase = cardDatabase;
        this.filterService = filterService;
        this.sortingService = sortingService;
        this.cardService = cardService;
    }

    randomize(strategy: RandomizationStrategy, filter?: CardFilter): Deck {
        const deck = this.deckService.createEmptyDeck();
        let cards = this.cardDatabase.getCards();
        if (filter != null) {
            cards = this.filterService.filter(cards, filter);
        }

        const format = filter?.format ?? null;
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            cards = this.sortingService.shuffle(cards);
            const deckPartCards = deck.parts.get(deckPart)!;

            let i = 0;
            while (
                deckPartCards.length < deckPart.recommended &&
                i < cards.length
            ) {
                const card = cards[i];
                if (this.deckService.canAdd(deck, deckPart, format, card)) {
                    deckPartCards.push(
                        ...this.getRandomAmountOfCard(
                            deckPart,
                            deckPartCards,
                            format,
                            card,
                            false
                        )
                    );
                }

                i++;
            }
        }

        return this.deckService.sort(deck);
    }

    private getRandomAmountOfCard(
        deckPart: DeckPart,
        deckPartCards: Card[],
        format: Format | null,
        card: Card,
        preferPlaySet: boolean
    ): Card[] {
        const banState = this.cardService.getBanStateByFormat(card, format);
        const spaceLeft = deckPart.recommended - deckPartCards.length;
        const limit = min([spaceLeft, banState.count])!;
        let randomCardCount = this.getRandomCardCount(preferPlaySet);
        if (randomCardCount > limit) {
            randomCardCount = limit;
        }
        return new Array(randomCardCount).fill(card);
    }

    private getRandomCardCount(preferPlaySet: boolean): number {
        const seed = Math.random();

        if (preferPlaySet) {
            if (seed > 0.65) {
                return 1;
            }
            if (seed > 0.5) {
                return 2;
            }
            return 3;
        }
        if (seed > 0.25) {
            return 1;
        }
        if (seed > 0.1) {
            return 2;
        }
        return 3;
    }
}

export { DeckRandomizationService, RandomizationStrategy };
