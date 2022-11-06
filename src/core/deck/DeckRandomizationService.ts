import { random, sampleSize, shuffle, words } from "lodash";
import type { Card } from "../card/Card";
import type { CardDatabase } from "../card/CardDatabase";
import type { CardService } from "../card/CardService";
import type { CardFilter, FilterService } from "../card/FilterService";
import type { Format } from "../card/format/Format";
import type { SortingService } from "../card/SortingService";
import { CardTypeCategory } from "../card/type/CardTypeCategory";
import type { Deck } from "./Deck";
import { DECK_PART_ARR, DeckPart } from "./DeckPart";
import { DefaultDeckPartConfig } from "./DeckPartConfig";
import type { DeckService } from "./DeckService";

export enum RandomizationStrategy {
	NORMAL = "Normal",
	ARCHETYPE_1 = "1 Archetype",
	ARCHETYPE_2 = "2 Archetypes",
	ARCHETYPE_3 = "3 Archetypes",
	HIGHLANDER = "Highlander",
}

export type TypeCategoryWeighting = ReadonlyMap<
	CardTypeCategory,
	number | null
>;

export type RandomizationOptions = Partial<{
	/**
	 * Filter to apply to card pool before randomization (e.g. a certain format).
	 */
	readonly filter: CardFilter;

	/**
	 * Percentage of cards a deck should have by card type category.
	 * E.g. MONSTER with 0.65 would mean the deck should have around 65% monster cards.
	 * null means the ratio check will be skipped.
	 */
	readonly typeCategoryWeighting: TypeCategoryWeighting;
}>;

export const createDefaultTypeCategoryWeighting = (): TypeCategoryWeighting =>
	new Map([
		[CardTypeCategory.MONSTER, 0.625],
		[CardTypeCategory.SPELL, 0.275],
		[CardTypeCategory.TRAP, 0.1],
		[CardTypeCategory.SKILL, null],
	]);

export class DeckRandomizationService {
	private static readonly IGNORED_WORDS = new Set([
		// Articles
		"the",
		"a",
		"an",

		// Conjunctions
		"for",
		"and",
		"nor",
		"but",
		"or",
		"yet",
		"so",

		// Prepositions
		"on",
		"in",
		"at",
		"for",
		"to",
		"by",
		"with",
		"of",

		// Misc.
		"as",
		"be",
	]);

	readonly #cardDatabase: CardDatabase;
	readonly #deckService: DeckService;
	readonly #filterService: FilterService;
	readonly #sortingService: SortingService;
	readonly #cardService: CardService;

	constructor(
		cardDatabase: CardDatabase,
		deckService: DeckService,
		filterService: FilterService,
		sortingService: SortingService,
		cardService: CardService
	) {
		this.#deckService = deckService;
		this.#cardDatabase = cardDatabase;
		this.#filterService = filterService;
		this.#sortingService = sortingService;
		this.#cardService = cardService;
	}

	/**
	 * Creates a random deck for the given strategy and filter.
	 *
	 * @param strategy Strategy to use.
	 * @param options Additional options.
	 * @return Randomized deck.
	 */
	randomize(
		strategy: RandomizationStrategy,
		options: RandomizationOptions = {}
	): Deck {
		const typeCategoryWeighting =
			options.typeCategoryWeighting ??
			createDefaultTypeCategoryWeighting();
		const filter = options.filter ?? null;
		const format = filter?.format ?? null;

		let cards = this.#cardDatabase.getCards();
		if (filter != null) {
			cards = this.#filterService.filter(cards, filter);
		}

		const primaryPools: Card[][] = [];
		const secondaryPool: Card[] = cards;

		const archetypeCount = this.#getArchetypeCount(strategy);
		if (archetypeCount > 0) {
			primaryPools.push(
				...this.#getRandomArchetypeCardPools(cards, archetypeCount)
			);
		}

		const deck = this.#deckService.createEmptyDeck();
		for (const deckPart of DECK_PART_ARR) {
			if (primaryPools.length > 0) {
				const cardCountPerPool = this.#getCardCountPerPool(strategy);
				for (const primaryPool of primaryPools) {
					this.#addCards(
						deck,
						deckPart,
						format,
						strategy,
						primaryPool,
						deckPart === DeckPart.MAIN,
						cardCountPerPool,
						typeCategoryWeighting
					);
				}
			}

			this.#addCards(
				deck,
				deckPart,
				format,
				strategy,
				secondaryPool,
				false,
				null,
				typeCategoryWeighting
			);
		}
		deck.name = this.#createName(deck);
		return this.#deckService.sort(deck);
	}

	#getRandomArchetypeCardPools(
		cards: Card[],
		archetypeCount: number
	): Card[][] {
		const pool: Card[][] = [];
		const archetypes = shuffle(this.#cardDatabase.getArchetypes());
		for (const archetype of archetypes) {
			if (pool.length >= archetypeCount) {
				break;
			}
			const archetypeCards = this.#filterService.filter(cards, {
				archetype: archetype,
			});
			if (archetypeCards.length > 0) {
				pool.push(archetypeCards);
			}
		}
		return pool;
	}

	/**
	 * Attempts to add cards from the pool to the deck for the given part.
	 *
	 * @param deck Deck to add to.
	 * @param deckPart Deck part to add to.
	 * @param format Format to validate against.
	 * @param strategy Strategy that is in use.
	 * @param pool Pool to pick cards from.
	 * @param preferPlaySet If higher counts of cards should be preferred.
	 * @param limit Optional limit of how many cards should be added. Note that is only a soft limit,
	 *              only limiting the next cycle of card picking, not the card count of an already picked card.
	 * @param typeCategoryWeighting see {@link RandomizationOptions}.
	 */
	#addCards(
		deck: Deck,
		deckPart: DeckPart,
		format: Format | null,
		strategy: RandomizationStrategy,
		pool: Card[],
		preferPlaySet: boolean,
		limit: number | null,
		typeCategoryWeighting: TypeCategoryWeighting
	): void {
		const deckPartCards = deck.parts[deckPart];
		const initialLength = deckPartCards.length;
		const deckPartLimit = this.#getDeckPartLimit(strategy, deckPart);
		for (const card of shuffle(pool)) {
			// If we reached the deck part limit: break, skipping all other cards in the pool.
			if (deckPartCards.length >= deckPartLimit) {
				break;
			}

			// If a limit is set and the count of cards added in this #addCards invocation reaches the limit: break.
			if (
				limit != null &&
				deckPartCards.length - initialLength >= limit
			) {
				break;
			}

			// Once half of the main deck part is full, check against ratios.
			// If a card ratio is exceeded: continue with the next card.
			if (
				deckPart === DeckPart.MAIN &&
				deckPartCards.length >= deckPartLimit / 2
			) {
				const typeCategoryRatio: number | null =
					typeCategoryWeighting.get(card.type.category) ?? null;
				const cardsOfTypeCategoryCount = deckPartCards.filter(
					(deckPartCard) =>
						deckPartCard.type.category === card.type.category
				).length;
				if (
					typeCategoryRatio != null &&
					cardsOfTypeCategoryCount >=
						deckPartLimit * typeCategoryRatio
				) {
					continue;
				}
			}

			const randomCardCount = this.#getRandomCardCount(
				strategy,
				preferPlaySet
			);
			// Attempt to add n cards, stopping if one of the additions is not possible.
			for (let i = 0; i < randomCardCount; i++) {
				if (!this.#deckService.canAdd(deck, card, deckPart, format)) {
					break;
				}
				deckPartCards.push(card);
			}
		}
	}

	#getArchetypeCount(strategy: RandomizationStrategy): number {
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

	#getCardCountPerPool(strategy: RandomizationStrategy): number {
		const archetypeCount = this.#getArchetypeCount(strategy);
		// Currently, only archetype strategies can use the primary pool.
		if (archetypeCount === 0) {
			throw new TypeError(
				"Cannot determine card count per pool for this strategy."
			);
		}
		return Math.ceil(30 / archetypeCount);
	}

	#getDeckPartLimit(
		strategy: RandomizationStrategy,
		deckPart: DeckPart
	): number {
		if (strategy === RandomizationStrategy.HIGHLANDER) {
			if (deckPart === DeckPart.SIDE) {
				return 0;
			}
			return DefaultDeckPartConfig[deckPart].max;
		}

		return DefaultDeckPartConfig[deckPart].recommended;
	}

	#getRandomCardCount(
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

	#createName(deck: Deck): string {
		const countedCards = this.#cardService.countByCard([
			...deck.parts[DeckPart.MAIN],
			...deck.parts[DeckPart.EXTRA],
		]);

		const countRequiredForPlaySet = Math.max(
			...Array.from(countedCards.values())
		);

		const wordPool = new Set<string>();
		for (const [card, count] of countedCards) {
			if (count >= countRequiredForPlaySet) {
				for (const word of words(card.name)) {
					if (
						!DeckRandomizationService.IGNORED_WORDS.has(
							word.toLowerCase()
						)
					) {
						wordPool.add(word);
					}
				}
			}
		}
		return sampleSize(
			Array.from(wordPool.values()),
			random(2, 3, false)
		).join(" ");
	}
}
