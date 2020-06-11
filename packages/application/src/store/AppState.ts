import { CurrencyState } from "./modules/currency";
import { FormatState } from "./modules/format";
import { DeckState } from "./modules/deck";
import { DataState } from "./modules/data";

export interface AppState {
    data: DataState;
    deck: DeckState;
    currency: CurrencyState;
    format: FormatState;
}
