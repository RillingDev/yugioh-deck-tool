import { removeEnd } from "lightdash";
import type { Card, CardDatabase, CardService } from "@/core/lib";
import { CardTypeCategory, DeckPart } from "@/core/lib";

export class DeckController {
	readonly #cardDatabase: CardDatabase;
	readonly #cardService: CardService;

	constructor(cardDatabase: CardDatabase, cardService: CardService) {
		this.#cardDatabase = cardDatabase;
		this.#cardService = cardService;
	}

	/**
	 * Calculates count of card types.
	 * For main and side deck, count will be split by monster, spell, etc.,
	 * whereas it will be split by monster subtype for the extra deck.
	 *
	 * @param deckPart Deck-part that is being used.
	 * @param cards Cards to analyse.
	 * @return Array of type and count pairs.
	 */
	calculateDetailedTypeStats(
		deckPart: DeckPart,
		cards: ReadonlyArray<Card>
	): [string, number][] {
		if (deckPart === DeckPart.EXTRA) {
			const countedByType = this.#cardService.countByType(cards);
			return this.#cardDatabase
				.getTypes(CardTypeCategory.MONSTER)
				.filter(
					(cardType) =>
						countedByType.has(cardType) &&
						countedByType.get(cardType)! > 0
				)
				.map((cardType) => [
					removeEnd(cardType.name, " Monster"),
					countedByType.get(cardType)!,
				]);
		}

		const countedByTypeCategory =
			this.#cardService.countByTypeCategory(cards);
		return Object.values(CardTypeCategory)
			.filter(
				(typeCategory) =>
					countedByTypeCategory.has(typeCategory) &&
					countedByTypeCategory.get(typeCategory)! > 0
			)
			.map((typeCategory) => [
				typeCategory,
				countedByTypeCategory.get(typeCategory)!,
			]);
	}
}
