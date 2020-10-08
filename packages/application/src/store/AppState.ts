import type { CurrencyState } from "./modules/currency";
import type { FormatState } from "./modules/format";
import type { DeckState } from "./modules/deck";
import type { DataState } from "./modules/data";

export interface AppState {
    data: DataState;

    deck: DeckState;
    currency: CurrencyState;
    format: FormatState;
}
