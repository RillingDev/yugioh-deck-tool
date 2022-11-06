import { intersection, isEmpty } from "lodash";
import type { BanlistService } from "./banlist/BanlistService";
import type { BanState } from "./banlist/BanState";
import type { Card } from "./Card";
import type { CardPredicate } from "./CardPredicateService";
import type { CardService } from "./CardService";
import type { Format } from "./format/Format";
import type { CardSet } from "./set/CardSet";
import type { CardType } from "./type/CardType";
import type { CardTypeCategory } from "./type/CardTypeCategory";

export type CardFilter = Partial<{
	/**
	 * Custom filter parts (e.g. user owned cards).
	 * Executed in order.
	 * If all predicates return true, the card is included in the result.
	 */
	customPredicates: CardPredicate[];

	/**
	 * Card name (sub)string matcher.
	 */
	name: string | null;

	/**
	 * Card description/effect substring matcher.
	 */
	description: string | null;

	/**
	 * This can be used when wanting only type-category accuracy.
	 * For exact type matching see {@link #type}.
	 */
	typeCategory: CardTypeCategory | null;

	/**
	 * This can be used when wanting exact type accuracy.
	 * For type category matching see {@link #typeCategory}.
	 */
	type: CardType | null;
	subType: string | null;

	attribute: string | null;
	level: number | null;
	linkMarkers: string[];

	archetype: string | null;
	format: Format | null;

	/**
	 * Only available if #format is set.
	 */
	banState: BanState | null;

	sets: CardSet[];
}>;

export class FilterService {
	readonly #cardService: CardService;
	readonly #banlistService: BanlistService;

	constructor(cardService: CardService, banlistService: BanlistService) {
		this.#cardService = cardService;
		this.#banlistService = banlistService;
	}

	/**
	 * Filters a list of cards by a filter.
	 *
	 * @param cards Cards to filter.
	 * @param filter Filter to apply. Generally null or empty array properties mean a check should be skipped.
	 * @return Filtered cards.
	 */
	filter(cards: ReadonlyArray<Card>, filter: CardFilter): Card[] {
		return cards.filter((card) => {
			if (
				filter.customPredicates != null &&
				!filter.customPredicates.every((predicate) => predicate(card))
			) {
				return false;
			}

			if (
				filter.name != null &&
				filter.name.length > 0 &&
				!this.#cardService
					.getAllNames(card)
					.some((name) =>
						name.toLowerCase().includes(filter.name!.toLowerCase())
					)
			) {
				return false;
			}

			if (
				filter.description != null &&
				filter.description.length > 0 &&
				!card.description
					.toLowerCase()
					.includes(filter.description.toLowerCase())
			) {
				return false;
			}

			if (
				filter.typeCategory != null &&
				card.type.category != filter.typeCategory
			) {
				return false;
			}
			if (filter.type != null && card.type != filter.type) {
				return false;
			}

			if (filter.subType != null && card.subType != filter.subType) {
				return false;
			}
			if (filter.level != null && card.level != filter.level) {
				return false;
			}
			if (
				filter.attribute != null &&
				card.attribute != filter.attribute
			) {
				return false;
			}
			if (
				filter.linkMarkers != null &&
				filter.linkMarkers.length > 0 &&
				(card.linkMarkers == null ||
					filter.linkMarkers.some(
						(linkMarker) => !card.linkMarkers!.includes(linkMarker)
					))
			) {
				return false;
			}
			if (
				filter.archetype != null &&
				card.archetype !== filter.archetype
			) {
				return false;
			}

			if (
				filter.format != null &&
				!card.formats.includes(filter.format)
			) {
				return false;
			}
			if (
				filter.banState != null &&
				filter.format != null &&
				this.#banlistService.getBanStateByFormat(
					card,
					filter.format
				) !== filter.banState
			) {
				return false;
			}

			if (
				filter.sets != null &&
				filter.sets.length > 0 &&
				isEmpty(intersection(card.sets, filter.sets))
			) {
				return false;
			}

			return true;
		});
	}

	/**
	 * Creates an empty filter instance including all optional fields initialized.
	 *
	 * @return Empty filter.
	 */
	createDefaultFilter(): CardFilter {
		return {
			customPredicates: [],

			name: null,
			description: null,

			typeCategory: null,
			type: null,
			subType: null,

			attribute: null,
			level: null,
			linkMarkers: [],

			archetype: null,
			format: null,
			banState: null,

			sets: [],
		};
	}
}
