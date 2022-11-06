import type { Card } from "./Card";
import { CardTypeCategory } from "./type/CardTypeCategory";
import type { CardDatabase } from "./CardDatabase";
import { Format } from "./format/Format";

export enum SortingStrategy {
	/**
	 * Sort cards like they would appear in a sorted deck
	 */
	DEFAULT = "Default",

	NAME = "Name",

	ATK = "ATK",
	DEF = "DEF",
	LEVEL = "Level",

	VIEWS = "Views",

	RELEASE_TCG = "Date: TCG",
	RELEASE_OCG = "Date: OCG",
}

export enum SortingOrder {
	DESC = "Desc",
	ASC = "Asc",
}

export interface SortingOptions {
	strategy: SortingStrategy;
	order?: SortingOrder;
}

type Comparator<T> = (a: T, b: T) => number;

export class SortingService {
	readonly #cardDatabase: CardDatabase;

	constructor(cardDatabase: CardDatabase) {
		this.#cardDatabase = cardDatabase;
	}

	/**
	 * Sorts a list of cards.
	 *
	 * @param cards Cards to filter.
	 * @param options Options describing how to sort.
	 * @return Sorted cards.
	 */
	sort(cards: Card[], options: SortingOptions): Card[] {
		const comparator = this.#findComparator(
			options.strategy,
			options.order ?? SortingOrder.DESC
		);
		return cards.sort(comparator);
	}

	#findComparator(
		strategy: SortingStrategy,
		order: SortingOrder
	): Comparator<Card> {
		if (strategy === SortingStrategy.NAME) {
			return this.#createNameComparator(order);
		}
		if (strategy === SortingStrategy.ATK) {
			return this.#createAtkComparator(order);
		}
		if (strategy === SortingStrategy.DEF) {
			return this.#createDefComparator(order);
		}
		if (strategy === SortingStrategy.LEVEL) {
			return this.#createLevelComparator(order);
		}
		if (strategy === SortingStrategy.RELEASE_TCG) {
			return this.#compareReleaseDate(order, Format.TCG);
		}
		if (strategy === SortingStrategy.RELEASE_OCG) {
			return this.#compareReleaseDate(order, Format.OCG);
		}
		if (strategy === SortingStrategy.VIEWS) {
			return this.#createViewsComparator(order);
		} else {
			return this.#createDefaultComparator(order);
		}
	}

	/**
	 * Deck-sorting function loosely based on
	 * {@see https://github.com/Fluorohydride/ygopro}'s ./gframe/client_card.cpp sorting methods
	 */
	#createDefaultComparator(order: SortingOrder): Comparator<Card> {
		const levelComparator = this.#createLevelComparator(order);
		const sortGroupComparator = this.#createSortGroupComparator(order);
		const atkComparator = this.#createAtkComparator(order);
		const defComparator = this.#createDefComparator(order);
		const subTypeComparator = this.#createSubTypeComparator(order);
		const nameComparator = this.#createNameComparator(order);
		return (a, b) => {
			// First, sort after the sort group.
			if (a.type.sortGroup != b.type.sortGroup) {
				return sortGroupComparator(a, b);
			}

			// For monsters, sort by monster related attributes.
			if (a.type.category === CardTypeCategory.MONSTER) {
				if (a.level !== b.level) {
					return levelComparator(a, b);
				}
				if (a.atk !== b.atk) {
					return atkComparator(a, b);
				}
				if (a.def !== b.def) {
					return defComparator(a, b);
				}
			} else {
				// For non-monsters, sort just by sub-type.
				if (a.subType != b.subType) {
					return subTypeComparator(a, b);
				}
			}

			// As the last step, sort by name.
			return nameComparator(a, b);
		};
	}

	#createAtkComparator(order: SortingOrder): Comparator<Card> {
		return this.#createComparator((card) => card.atk ?? 0, order);
	}

	#createDefComparator(order: SortingOrder): Comparator<Card> {
		return this.#createComparator((card) => card.def ?? 0, order);
	}

	#createLevelComparator(order: SortingOrder): Comparator<Card> {
		return this.#createComparator((card) => card.level ?? 0, order);
	}

	#createViewsComparator(order: SortingOrder): Comparator<Card> {
		return this.#createComparator((card) => card.views, order);
	}

	#createSortGroupComparator(order: SortingOrder): Comparator<Card> {
		const orderModifier = this.#getOrderModifier(order) * -1;
		return (a: Card, b: Card) =>
			(b.type.sortGroup - a.type.sortGroup) * orderModifier;
	}

	#compareReleaseDate(
		order: SortingOrder,
		format: Format.TCG | Format.OCG
	): Comparator<Card> {
		const fallbackRelease = order === SortingOrder.ASC ? Infinity : 0;
		return this.#createComparator(
			(card) => card.release[format] ?? fallbackRelease,
			order
		);
	}

	#createNameComparator(order: SortingOrder): Comparator<Card> {
		return order === SortingOrder.DESC
			? (a: Card, b: Card) => a.name.localeCompare(b.name)
			: (a: Card, b: Card) => b.name.localeCompare(a.name);
	}

	#createSubTypeComparator(order: SortingOrder): Comparator<Card> {
		return (a: Card, b: Card) => {
			const subTypes = this.#cardDatabase.getSubTypes(a.type.category);
			return (
				(subTypes.indexOf(a.subType) - subTypes.indexOf(b.subType)) *
				this.#getOrderModifier(order)
			);
		};
	}

	#createComparator(
		selector: (card: Card) => number,
		order: SortingOrder
	): Comparator<Card> {
		return (a: Card, b: Card) =>
			(selector(b) - selector(a)) * this.#getOrderModifier(order);
	}

	#getOrderModifier(order: SortingOrder): number {
		return order === SortingOrder.ASC ? -1 : 1;
	}
}
