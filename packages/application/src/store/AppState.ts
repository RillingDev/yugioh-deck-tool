import type { FormatState } from "./modules/format";
import type { DeckState } from "./modules/deck";
import type { DataState } from "./modules/data";
import type { CollectionState } from "./modules/collection";

export interface AppState {
	data: DataState;

	deck: DeckState;
	format: FormatState;
	collection: CollectionState;
}
