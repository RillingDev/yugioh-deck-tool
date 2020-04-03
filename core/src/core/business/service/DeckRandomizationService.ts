import { inject, injectable } from "inversify";
import { CardFilter, FilterService } from "./FilterService";
import { Deck } from "../../model/ygo/Deck";
import { CardDatabase } from "../CardDatabase";
import { DeckService } from "./DeckService";
import { TYPES } from "../../../types";
import {
    DeckPart,
    DEFAULT_DECK_PART_ARR,
    DefaultDeckPart,
} from "../../model/ygo/DeckPart";
import { SortingService } from "./SortingService";
import { CardService } from "./CardService";
import { flatten, random, sampleSize, shuffle, uniq, words } from "lodash";
import { Card } from "../../model/ygo/Card";
import { Format } from "../../model/ygo/Format";

enum RandomizationStrategy {
    NORMAL = "Normal",
    ARCHETYPE_1 = "1 Archetype",
    ARCHETYPE_2 = "2 Archetypes",
    ARCHETYPE_3 = "3 Archetypes",
    HIGHLANDER = "Highlander",
}

@injectable()
class DeckRandomizationService {
    private static readonly IGNORED_WORDS = new Set([
        "a",
        "an",
        "as",
        "at",
        "by",
        "for",
        "in",
        "of",
        "on",
        "the",
        "to",
        "with",
        "from",
    ]);

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

    /**
     * Creates a random deck for the given strategy and filter.
     *
     * @param strategy Strategy to use.
     * @param filter Filter to apply to card pool before randomization (e.g. a certain format).
     * @return Randomized deck.
     */
    public randomize(
        strategy: RandomizationStrategy,
        filter?: CardFilter
    ): Deck {
        const deck = this.deckService.createEmptyDeck();
        let cards = this.cardDatabase.getCards();
        if (filter != null) {
            cards = this.filterService.filter(cards, filter);
        }

        const primaryPools: Card[][] = [];
        const secondaryPool: Card[] = cards;

        const archetypeCount = this.getArchetypeCount(strategy);
        const isArchetypeStrategy = archetypeCount !== 0;
        if (isArchetypeStrategy) {
            primaryPools.push(
                ...this.getRandomArchetypeCardPools(cards, archetypeCount)
            );
        }

        const format = filter?.format ?? null;
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            for (const primaryPool of primaryPools) {
                let cardsPerPool = 0;
                if (isArchetypeStrategy) {
                    cardsPerPool = this.getCardsPerArchetypeCount(strategy);
                }

                this.addCards(
                    deck,
                    deckPart,
                    format,
                    strategy,
                    true,
                    primaryPool,
                    cardsPerPool
                );
            }

            this.addCards(
                deck,
                deckPart,
                format,
                strategy,
                false,
                secondaryPool,
                null
            );
        }
        deck.name = this.createName(deck);
        return this.deckService.sort(deck);
    }

    private getRandomArchetypeCardPools(
        cards: Card[],
        archetypeCount: number
    ): Card[][] {
        const pool: Card[][] = [];
        const archetypes = shuffle(this.cardDatabase.getArchetypes());
        for (const archetype of archetypes) {
            if (pool.length >= archetypeCount) {
                break;
            }
            const archetypeCards = this.findArchetypeCards(cards, archetype);
            if (archetypeCards.length > 0) {
                pool.push(archetypeCards);
            }
        }
        return pool;
    }

    /**
     * Attempts to adds cards from the pool to the deck for the given part.
     *
     * @param deck Deck to add to.
     * @param deckPart Deck part to add to.
     * @param format Format to validate against.
     * @param strategy Strategy that is in use.
     * @param isPrimaryPool If the pool should be treated as primary pool. (different card count calculation)
     * @param pool Pool to pick cards from.
     * @param limit Optional limit of how many cards should be added. Note that is only a soft limit,
     *              only limiting the next cycle of card picking, not the card count of an already picked card.
     */
    private addCards(
        deck: Deck,
        deckPart: DeckPart,
        format: Format | null,
        strategy: RandomizationStrategy,
        isPrimaryPool: boolean,
        pool: Card[],
        limit: number | null
    ): void {
        const deckPartCards = deck.parts.get(deckPart)!;
        const initialLength = deckPartCards.length;
        const deckPartLimit = this.getDeckPartLimit(deckPart, strategy);
        for (const card of shuffle(pool)) {
            // If we reached the deckpart limit: break, skipping all other cards in the pool
            if (deckPartCards.length >= deckPartLimit) {
                break;
            }
            // If a limit is set and the count of cards added in this #addCards invocation reaches the limit: break
            if (
                limit != null &&
                deckPartCards.length - initialLength >= limit
            ) {
                break;
            }
            const randomCardCount = this.getRandomCardCount(
                strategy,
                isPrimaryPool
            );
            // Attempt to add n cards, stopping if one of the additions is not possible.
            for (let i = 0; i < randomCardCount; i++) {
                if (!this.deckService.canAdd(deck, deckPart, format, card)) {
                    break;
                }
                deckPartCards.push(card);
            }
        }
    }

    private getArchetypeCount(strategy: RandomizationStrategy): number {
        if (strategy === RandomizationStrategy.ARCHETYPE_1) {
            return 1;
        }
        if (strategy === RandomizationStrategy.ARCHETYPE_2) {
            return 2;
        }
        if (strategy === RandomizationStrategy.ARCHETYPE_3) {
            return 3;
        }
        return 0;
    }

    private getCardsPerArchetypeCount(strategy: RandomizationStrategy): number {
        return Math.ceil(30 / this.getArchetypeCount(strategy));
    }

    private getDeckPartLimit(
        deckPart: DeckPart,
        strategy: RandomizationStrategy
    ): number {
        if (strategy === RandomizationStrategy.HIGHLANDER) {
            if (deckPart === DefaultDeckPart.SIDE) {
                return 0;
            }
            return deckPart.max;
        }

        return deckPart.recommended;
    }

    private getRandomCardCount(
        strategy: RandomizationStrategy,
        isPrimaryPool: boolean
    ): number {
        if (strategy === RandomizationStrategy.HIGHLANDER) {
            return 1;
        }

        const seed = random(0, 1, true);
        if (isPrimaryPool) {
            if (seed > 0.65) {
                return 3;
            }
            if (seed > 0.35) {
                return 2;
            }
            return 1;
        }
        if (seed > 0.75) {
            return 3;
        }
        if (seed > 0.6) {
            return 2;
        }
        return 1;
    }

    private createName(deck: Deck): string {
        const cardsWithPlaySets = Array.from(
            this.cardService
                .countCards([
                    ...deck.parts.get(DefaultDeckPart.MAIN)!,
                    ...deck.parts.get(DefaultDeckPart.EXTRA)!,
                ])
                .entries()
        )
            .filter(([, count]) => count === 3)
            .map(([card]) => card);
        const cardsWithPlaySetsWords = flatten(
            cardsWithPlaySets.map((card) =>
                words(card.name).filter(
                    (word) =>
                        !DeckRandomizationService.IGNORED_WORDS.has(
                            word.toLowerCase()
                        )
                )
            )
        );
        return sampleSize(
            uniq(cardsWithPlaySetsWords),
            random(2, 3, false)
        ).join(" ");
    }

    private findArchetypeCards(cards: Card[], archetype: string): Card[] {
        return this.filterService.filter(cards, {
            name: null,

            typeGroup: null,
            type: null,

            race: null,
            attribute: null,
            level: null,
            linkMarker: null,
            archetype: archetype,

            format: null,
            banState: null,

            sets: [],
        });
    }
}

export { DeckRandomizationService, RandomizationStrategy };
