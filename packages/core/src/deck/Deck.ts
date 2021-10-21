import type { Card } from "../card/Card";
import type { DeckPart } from "./DeckPart";

export interface Deck {
	name: string | null;
	parts: {
		[DeckPart.MAIN]: Card[];
		[DeckPart.EXTRA]: Card[];
		[DeckPart.SIDE]: Card[];
	};
}
