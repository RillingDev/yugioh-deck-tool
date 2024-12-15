import type { Card } from "../card/Card";

export enum DeckPart {
	MAIN = "main",
	EXTRA = "extra",
	SIDE = "side",
}

export const DECK_PART_ARR: readonly DeckPart[] = Object.values(DeckPart);

export interface Deck {
	name: string | null;
	parts: {
		[DeckPart.MAIN]: Card[];
		[DeckPart.EXTRA]: Card[];
		[DeckPart.SIDE]: Card[];
	};
}
