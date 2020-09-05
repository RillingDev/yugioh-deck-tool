import type { CardTypeCategory } from "./CardTypeCategory";
import type { DeckPart } from "../../deck/DeckPart";

/**
 * Card type, e.g. "Spell" or "Xyz Monster"
 */
interface CardType {
    readonly name: string;
    readonly category: CardTypeCategory; // The general kind of type, e.g. "Spell" or "Monster"
    readonly sortGroup: number; // Which position to put this kind of card type when sorting by type.
    readonly deckParts: Set<DeckPart>; // Deck-parts which this type is allowed in.
}

export { CardType };
