import type { Deck } from "./Deck";
import type { Card } from "../card/Card";
import type { DeckService } from "./DeckService";
import { DefaultDeckPartConfig } from "./DeckPartConfig";
import type { CardService } from "../card/CardService";
import { CardTypeCategory } from "../card/type/CardTypeCategory";
import type { FilterService } from "../card/FilterService";
import { DECK_PART_ARR, DeckPart } from "./DeckPart";

export class DeckExportService {
	readonly #deckService: DeckService;
	readonly #cardService: CardService;
	readonly #filterService: FilterService;

	constructor(
		deckService: DeckService,
		cardService: CardService,
		filterService: FilterService
	) {
		this.#deckService = deckService;
		this.#cardService = cardService;
		this.#filterService = filterService;
	}

	/**
	 * Creates a shareable text in the following format for a deck:
	 * <pre>
	 * Monster:
	 * 1x Foo
	 * 3x Fizz
	 *
	 * Spell:
	 * 3x Bar
	 *
	 * Side:
	 * 1x Foo
	 * </pre>
	 *
	 * @param deck Deck to create the text for.
	 * @return Text form of the deck.
	 */
	toShareableText(deck: Deck): string {
		const result: string[] = [];
		for (const deckPart of DECK_PART_ARR) {
			const cards = deck.parts[deckPart];
			// Main deck cards also get split up by type category.
			if (deckPart === DeckPart.MAIN) {
				for (const typeCategory of Object.values(CardTypeCategory)) {
					result.push(
						...this.#createCardList(
							typeCategory,
							this.#filterService.filter(cards, {
								typeCategory: typeCategory,
							})
						)
					);
				}
			} else {
				result.push(
					...this.#createCardList(
						DefaultDeckPartConfig[deckPart].name,
						cards
					)
				);
			}
		}
		return result.join("\n");
	}

	#createCardList(sectionName: string, cards: Card[]): string[] {
		if (cards.length === 0) {
			return [];
		}
		const result: string[] = [];
		result.push(`${sectionName}:`);
		result.push(...this.#cardService.createFormattedCardCountList(cards));
		result.push("");
		return result;
	}

	/**
	 * Creates an affiliate buy link of a deck for tcgplayer.com.
	 *
	 * @see https://docs.tcgplayer.com/docs/mass-entry-and-affiliate-linking
	 * @param deck Deck to create a link for.
	 * @param affiliate Tcgplayer.com affiliate code/source.
	 * @return Buy link.
	 */
	toBuyLink(
		deck: Deck,
		affiliate: { medium: string; source: string } | null
	): URL {
		const countedCards: Map<Card, number> = this.#cardService.countByCard(
			this.#deckService.getAllCards(deck)
		);
		const cardListUriParam =
			Array.from(countedCards.entries())
				.map(([card, count]) => `${count} ${card.name}`)
				.join("||") + "||";

		const buyLink = new URL("massentry", "https://www.tcgplayer.com");
		buyLink.searchParams.append("productline", "Yugioh");
		if (affiliate != null) {
			buyLink.searchParams.append("utm_campaign", "affiliate");
			buyLink.searchParams.append("utm_medium", affiliate.medium);
			buyLink.searchParams.append("utm_source", affiliate.source);
		}
		buyLink.searchParams.append("c", cardListUriParam);
		return buyLink;
	}
}
