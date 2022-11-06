import { DefaultDeckPartConfig } from "./DeckPartConfig";
import type { Card } from "../card/Card";
import type { Deck } from "./Deck";
import type { CardService } from "../card/CardService";
import type { Format } from "../card/format/Format";
import { insertAt, pullFirst } from "lightdash";
import { sampleSize, shuffle } from "lodash";
import type { SortingService } from "../card/SortingService";
import { SortingStrategy } from "../card/SortingService";

import { CardTypeCategory } from "../card/type/CardTypeCategory";
import type { BanlistService } from "../card/banlist/BanlistService";
import { DECK_PART_ARR, DeckPart } from "./DeckPart";

export class DeckService {
	readonly #cardService: CardService;
	readonly #sortingService: SortingService;
	readonly #banlistService: BanlistService;

	constructor(
		cardService: CardService,
		sortingService: SortingService,
		banlistService: BanlistService
	) {
		this.#cardService = cardService;
		this.#sortingService = sortingService;
		this.#banlistService = banlistService;
	}

	/**
	 * Checks if a given card can be moved in the deck.
	 * Similar to {@link #canAdd}, with the difference that in this case
	 * the check is done against a copy of the deck with the card removed in order to correctly test the card count.
	 *
	 * @param deck Deck to check.
	 * @param card Card to check.
	 * @param oldDeckPart Deck part to card is moved from.
	 * @param newDeckPart Deck part to card is moved to.
	 * @param format Format to check for, may be null for none.
	 * @return if the card can be moved for these parameters.
	 */
	canMove(
		deck: Deck,
		card: Card,
		oldDeckPart: DeckPart,
		newDeckPart: DeckPart,
		format: Format | null
	): boolean {
		const deckWithoutCard = this.#cloneDeck(deck);
		this.removeCard(deckWithoutCard, card, oldDeckPart);

		return this.canAdd(deckWithoutCard, card, newDeckPart, format);
	}

	/**
	 * Checks if a given card can be added to the deck.
	 * Checks done include deck size check, banlist check, max count of card check
	 * and special handling for certain card types (e.g. skill cards)
	 *
	 * @param deck Deck to check addition for.
	 * @param card Card to check.
	 * @param deckPart Deck part to check addition for.
	 * @param format Format to check for, may be null for none.
	 * @return if the card can be added for these parameters.
	 */
	canAdd(
		deck: Deck,
		card: Card,
		deckPart: DeckPart,
		format: Format | null
	): boolean {
		// If the card is not allowed in this deck part, return false
		if (!card.type.deckParts.has(deckPart)) {
			return false;
		}

		// If adding would make the deck part be larger than allowed, return false
		const deckPartSize = deck.parts[deckPart].length;
		if (deckPartSize + 1 > DefaultDeckPartConfig[deckPart].max) {
			return false;
		}

		// If a skill card would be added with one already existing, return false
		if (
			card.type.category === CardTypeCategory.SKILL &&
			this.getAllCards(deck).some(
				(existingCard) =>
					existingCard.type.category === CardTypeCategory.SKILL
			)
		) {
			return false;
		}

		// If adding this card would make the total count of this card in this deck
		// be larger than allowed by the banlist, return false
		const count = this.getAllCards(deck).filter((existingCard) =>
			this.#cardService.isTreatedAsSame(existingCard, card)
		).length;
		const banState = this.#banlistService.getBanStateByFormat(card, format);
		return count < banState.count;
	}

	/**
	 * Finds a deck part this card can be added to, or null if none is available.
	 *
	 * @param deck Deck to check addition for.
	 * @param card Card to check.
	 * @param format Format to check for, may be null for none.
	 * @return Deck part the card can be added to.
	 */
	findAvailableDeckPart(
		deck: Deck,
		card: Card,
		format: Format | null
	): DeckPart | null {
		return (
			DECK_PART_ARR.find((currentDeckPart) =>
				this.canAdd(deck, card, currentDeckPart, format)
			) ?? null
		);
	}

	/**
	 * Adds a card.
	 * Make sure to use {@link #canAdd} before.
	 *
	 * @param deck Deck to add to.
	 * @param card Card to add.
	 * @param deckPart Deck part to add to.
	 * @param newIndex Optional index to add the card at.
	 */
	addCard(
		deck: Deck,
		card: Card,
		deckPart: DeckPart,
		newIndex?: number
	): void {
		const current = deck.parts[deckPart];
		if (newIndex != null) {
			insertAt(current, newIndex, card);
		} else {
			current.push(card);
		}
	}

	/**
	 * Removes a card. if the card cannot be found, nothing will be done.
	 *
	 * @param deck Deck to remove from.
	 * @param card Card to remove.
	 * @param deckPart Deck part to remove from.
	 * @param oldIndex Optional index to remove the card at.
	 */
	removeCard(
		deck: Deck,
		card: Card,
		deckPart: DeckPart,
		oldIndex?: number
	): void {
		const cards = deck.parts[deckPart];
		if (oldIndex != null) {
			if (cards[oldIndex] !== card) {
				throw new TypeError(
					"The given card does not exist at this index."
				);
			}
			cards.splice(oldIndex, 1);
		} else {
			pullFirst(cards, card);
		}
	}

	/**
	 * Move a card in its deck-part.
	 *
	 * @param deck Deck to use.
	 * @param card Card to move.
	 * @param deckPart Deck part to move in.
	 * @param oldIndex Index to move card from.
	 * @param newIndex Index to move card to.
	 */
	reorderCard(
		deck: Deck,
		card: Card,
		deckPart: DeckPart,
		oldIndex: number,
		newIndex: number
	): void {
		const cards = deck.parts[deckPart];
		if (cards[oldIndex] !== card) {
			throw new TypeError("The given card does not exist at this index.");
		}
		cards.splice(oldIndex, 1);
		insertAt(cards, newIndex, card);
	}

	/**
	 * Returns a sorted copy of the deck.
	 *
	 * @param deck Deck to sort.
	 * @return Sorted copy.
	 */
	sort(deck: Deck): Deck {
		const deckClone = this.#cloneDeck(deck);
		for (const deckPart of DECK_PART_ARR) {
			deckClone.parts[deckPart] = this.#sortingService.sort(
				deckClone.parts[deckPart],
				{
					strategy: SortingStrategy.DEFAULT,
				}
			);
		}
		return deckClone;
	}

	/**
	 * Returns a shuffled copy of the deck.
	 *
	 * @param deck Deck to shuffle.
	 * @return Shuffled copy.
	 */
	shuffle(deck: Deck): Deck {
		const deckClone = this.#cloneDeck(deck);
		for (const deckPart of DECK_PART_ARR) {
			deckClone.parts[deckPart] = shuffle(deckClone.parts[deckPart]);
		}
		return deckClone;
	}

	/**
	 * Simulates a starting hand.
	 *
	 * @param deck Deck to simulate for.
	 * @param goingFirst If the simulation should be for a player going first (instead of going second).
	 * @return The simulated starting hand cards.
	 */
	getSimulatedStartingHand(deck: Deck, goingFirst: boolean): Card[] {
		return sampleSize(deck.parts[DeckPart.MAIN], goingFirst ? 5 : 6);
	}

	/**
	 * Gets a list of all cards of all parts.
	 *
	 * @param deck Deck to get cards for.
	 * @return All cards of the deck.
	 */
	getAllCards(deck: Deck): Card[] {
		const result = [];
		for (const deckPart of DECK_PART_ARR) {
			result.push(...deck.parts[deckPart]);
		}
		return result;
	}

	/**
	 * Creates a new empty deck.
	 *
	 * @return Created deck.
	 */
	createEmptyDeck(): Deck {
		return {
			name: null,
			parts: {
				[DeckPart.MAIN]: [],
				[DeckPart.EXTRA]: [],
				[DeckPart.SIDE]: [],
			},
		};
	}

	#cloneDeck(deck: Deck): Deck {
		// Manual copy to avoid accidentally creating new cards.
		return {
			name: deck.name,
			parts: {
				[DeckPart.MAIN]: Array.from(deck.parts[DeckPart.MAIN]),
				[DeckPart.EXTRA]: Array.from(deck.parts[DeckPart.EXTRA]),
				[DeckPart.SIDE]: Array.from(deck.parts[DeckPart.SIDE]),
			},
		};
	}
}
