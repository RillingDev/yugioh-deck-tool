import { inject, injectable } from "inversify";
import { CardFilter, FilterService } from "./FilterService";
import { Deck } from "../../model/ygo/Deck";
import { CardDatabase } from "../CardDatabase";
import { DeckService } from "./DeckService";
import { TYPES } from "../../../types";
import {
    DeckPart,
    DEFAULT_DECK_PART_ARR,
    DefaultDeckPart
} from "../../model/ygo/DeckPart";
import { SortingService } from "./SortingService";
import { CardService } from "./CardService";
import { min, random, shuffle, words } from "lodash";
import { Card } from "../../model/ygo/Card";
import { Format } from "../../model/ygo/Format";

enum RandomizationStrategy {
    NORMAL = "Normal",
    ARCHETYPE_1 = "1 Archetype",
    ARCHETYPE_2 = "2 Archetypes",
    ARCHETYPE_3 = "3 Archetypes",
    HIGHLANDER = "Highlander"
}

@injectable()
class DeckRandomizationService {
    private static readonly IGNORED_WORDS = ["of", "the", "a", "an", "in"];

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
        let cards = Array.from(this.cardDatabase.getCards());
        if (filter != null) {
            cards = this.filterService.filter(cards, filter);
        }

        const primaryPool: Card[] = [];
        const secondaryCardPool: Card[] = cards;

        const archetypeCount = this.getArchetypeCount(strategy);
        if (archetypeCount !== 0) {
            for (const archetype of this.getRandomArchetypes(archetypeCount)) {
                primaryPool.push(...this.findArchetypeCards(cards, archetype));
            }
        }

        const format = filter?.format ?? null;
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            const deckPartCards = deck.parts.get(deckPart)!;

            for (const pool of [primaryPool, secondaryCardPool]) {
                const isPrimaryPool = pool === primaryPool;
                const shuffledPool = this.sortingService.shuffle(pool);

                let i = 0;
                while (
                    deckPartCards.length < deckPart.recommended &&
                    i < shuffledPool.length
                ) {
                    const card = shuffledPool[i];
                    if (
                        !this.shouldSkip(isPrimaryPool) &&
                        this.deckService.canAdd(deck, deckPart, format, card)
                    ) {
                        deckPartCards.push(
                            ...this.getRandomAmountOfCard(
                                deckPart,
                                deckPartCards,
                                format,
                                strategy,
                                isPrimaryPool,
                                card
                            )
                        );
                    }

                    i++;
                }
            }
        }
        deck.name = this.createName(deck);
        return this.deckService.sort(deck);
    }

    private getRandomArchetypes(archetypeCount: number): string[] {
        return shuffle(Array.from(this.cardDatabase.getArchetypes())).slice(
            0,
            archetypeCount
        );
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

            sets: []
        });
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

    private getRandomAmountOfCard(
        deckPart: DeckPart,
        deckPartCards: Card[],
        format: Format | null,
        strategy: RandomizationStrategy,
        preferPlaySet: boolean,
        card: Card
    ): Card[] {
        const banState = this.cardService.getBanStateByFormat(card, format);
        const spaceLeft = deckPart.recommended - deckPartCards.length;
        const limit = min([spaceLeft, banState.count])!;
        let randomCardCount =
            strategy === RandomizationStrategy.HIGHLANDER
                ? 1
                : this.getRandomCardCount(preferPlaySet);
        if (randomCardCount > limit) {
            randomCardCount = limit;
        }
        return new Array(randomCardCount).fill(card);
    }

    private getRandomCardCount(isPrimaryPool: boolean): number {
        const seed = Math.random();
        if (isPrimaryPool) {
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

    private shouldSkip(isPrimaryPool: boolean): boolean {
        const seed = Math.random();
        if (isPrimaryPool) {
            return seed > 0.85;
        }
        return seed > 0.5;
    }

    private createName(deck: Deck): string {
        const cards = [
            ...deck.parts.get(DefaultDeckPart.MAIN)!,
            ...deck.parts.get(DefaultDeckPart.EXTRA)!
        ];
        const wordCount = random(2, 3, false);
        return this.sortingService
            .shuffle(cards)
            .slice(0, wordCount)
            .map(card => this.getRandomWord(card))
            .join(" ");
    }

    private getRandomWord(card: Card): string {
        const shuffledWords = shuffle(
            words(card.name).filter(
                word => !DeckRandomizationService.IGNORED_WORDS.includes(word)
            )
        );
        if (shuffledWords.length === 0) {
            throw new Error("No words lefter after filtering!");
        }
        return shuffledWords[0];
    }
}

export { DeckRandomizationService, RandomizationStrategy };
