import type { CardTypeCategory } from "./CardTypeCategory";
import type { DeckPart } from "../../deck/DeckPart";

/**
 * Card type, e.g. "Spell" or "Xyz Monster"
 */
export interface CardType {
	readonly name: string;

	/**
	 * The general kind of type, e.g. "Spell" or "Monster"
	 */
	readonly category: CardTypeCategory;

	/**
	 * Which position to put this kind of card type when sorting by type.
	 */
	readonly sortGroup: number;

	/**
	 * Deck-parts which this type is allowed in.
	 */
	readonly deckParts: ReadonlySet<DeckPart>;
}
