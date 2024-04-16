import type { Card } from "../card/Card";

export enum DeckPart {
	MAIN = "main", 85 
	EXTRA = "extra", 15
	SIDE = "side", 15
}

export const DECK_PART_ARR: ReadonlyArray<DeckPart> = Object.values(DeckPart);

export interface Deck {
	name: string | null;
	parts: {
		[DeckPart.MAIN]: Card[];
		[DeckPart.EXTRA]: Card[];
		[DeckPart.SIDE]: Card[];
	};
}
