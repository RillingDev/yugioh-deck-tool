import { CardTypeGroup } from "./CardTypeGroup";
import { DeckPart } from "./DeckPart";

interface CardType {
    name: string;
    group: CardTypeGroup;
    sortGroup: number;
    deckPart: Set<DeckPart>;
}

export { CardType };
