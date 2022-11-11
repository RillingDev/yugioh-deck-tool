import type { CardType } from "./CardType";

export interface TypeCategoryValues {
	readonly subTypes: ReadonlyArray<string>;
	readonly types: ReadonlyArray<CardType>;
}
