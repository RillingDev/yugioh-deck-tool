import { inject, injectable } from "inversify";
import { CardFilter, FilterService } from "./FilterService";
import { Deck } from "../../model/ygo/Deck";
import { CardDatabase } from "../CardDatabase";
import { DeckService } from "./DeckService";
import { TYPES } from "../../../types";
import { DefaultDeckPartConfig } from "../../model/ygo/DeckPartConfig";
import { SortingService } from "./SortingService";
import { CardService } from "./CardService";
import { flatten, random, sampleSize, shuffle, uniq, words } from "lodash";
import { Card } from "../../model/ygo/Card";
import { Format } from "../../model/ygo/Format";
import { CardTypeGroup } from "../../model/ygo/CardTypeGroup";
import { DECK_PART_ARR, DeckPart } from "../../model/ygo/DeckPart";

enum RandomizationStrategy {
    NORMAL = "Normal",
    ARCHETYPE_1 = "1 Archetype",
    ARCHETYPE_2 = "2 Archetypes",
    ARCHETYPE_3 = "3 Archetypes",
    HIGHLANDER = "Highlander",
}

/**
 * @public
 */
@injectable()
class DeckRandomizationService {
    private static readonly IGNORED_WORDS = new Set([
        "a",
        "an",
        "and",
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

    /**
     * Percentage of cards a deck should have by card type group.
     * E.g. MONSTER with 0.65 would mean the deck should have around 65% monster cards.
     * null means the ratio check will be skipped.
     */
    private static readonly CARD_TYPE_GROUP_RATIO = new Map<
        CardTypeGroup,
        number | null
    >([
        [CardTypeGroup.MONSTER, 0.625],
        [CardTypeGroup.SPELL, 0.275],
        [CardTypeGroup.TRAP, 0.1],
        [CardTypeGroup.SKILL, null],
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
        for (const deckPart of DECK_PART_ARR) {
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
                    primaryPool,
                    deckPart === DeckPart.MAIN,
                    cardsPerPool
                );
            }

            this.addCards(
                deck,
                deckPart,
                format,
                strategy,
                secondaryPool,
                false,
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
     * @param pool Pool to pick cards from.
     *              only limiting the next cycle of card picking, not the card count of an already picked card.
     * @param preferPlaySet If higher counts of cards should be preferred.
     * @param limit Optional limit of how many cards should be added. Note that is only a soft limit,
     */
    private addCards(
        deck: Deck,
        deckPart: DeckPart,
        format: Format | null,
        strategy: RandomizationStrategy,
        pool: Card[],
        preferPlaySet: boolean,
        limit: number | null
    ): void {
        const deckPartCards = deck.parts[deckPart];
        const initialLength = deckPartCards.length;
        const deckPartLimit = this.getDeckPartLimit(deckPart, strategy);
        for (const card of shuffle(pool)) {
            // If we reached the deck part limit: break, skipping all other cards in the pool
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

            // Once half of the main deck part is full, check against ratios
            // If a card ratio is exceeded: continue with the next card
            if (
                deckPart === DeckPart.MAIN &&
                deckPartCards.length >= deckPartLimit / 2
            ) {
                const cardTypeGroupRatio:
                    | number
                    | null = DeckRandomizationService.CARD_TYPE_GROUP_RATIO.get(
                    card.type.group
                )!;
                const cardsOfTypeGroupCount = deckPartCards.filter(
                    (deckPartCard) =>
                        deckPartCard.type.group === card.type.group
                ).length;
                if (
                    cardTypeGroupRatio != null &&
                    cardsOfTypeGroupCount >= deckPartLimit * cardTypeGroupRatio
                ) {
                    continue;
                }
            }

            const randomCardCount = this.getRandomCardCount(
                strategy,
                preferPlaySet
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
            if (deckPart === DeckPart.SIDE) {
                return 0;
            }
            return DefaultDeckPartConfig[deckPart].max;
        }

        return DefaultDeckPartConfig[deckPart].recommended;
    }

    private getRandomCardCount(
        strategy: RandomizationStrategy,
        preferPlaySet: boolean
    ): number {
        if (strategy === RandomizationStrategy.HIGHLANDER) {
            return 1;
        }

        const seed = random(0, 1, true);
        if (preferPlaySet) {
            if (seed > 0.65) {
                return 3;
            }
            if (seed > 0.35) {
                return 2;
            }
            return 1;
        }
        if (seed > 0.8) {
            return 3;
        }
        if (seed > 0.65) {
            return 2;
        }
        return 1;
    }

    private createName(deck: Deck): string {
        const cardsWithPlaySets = Array.from(
            this.cardService
                .countCards([
                    ...deck.parts[DeckPart.MAIN],
                    ...deck.parts[DeckPart.EXTRA],
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
            archetype: archetype,
        });
    }
}

export { DeckRandomizationService, RandomizationStrategy };
