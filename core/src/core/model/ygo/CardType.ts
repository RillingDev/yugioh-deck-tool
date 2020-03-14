import { CardTypeGroup } from "./CardTypeGroup";
import { DeckPart } from "./DeckPart";

interface CardType {
    readonly name: string;
    readonly group: CardTypeGroup;
    readonly sortGroup: number;
    readonly deckPart: Set<DeckPart>;
}

export { CardType };
