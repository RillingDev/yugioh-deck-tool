export enum DeckPart {
	MAIN = "main",
	EXTRA = "extra",
	SIDE = "side",
}

export const DECK_PART_ARR: ReadonlyArray<DeckPart> = Object.values(DeckPart);
