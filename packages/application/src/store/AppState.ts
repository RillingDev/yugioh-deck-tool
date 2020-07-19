import { CurrencyState } from "./modules/currency";
import { FormatState } from "./modules/format";
import { DeckState } from "./modules/deck";
import { DataState } from "./modules/data";
import { InteractionState } from "./modules/interaction";

export interface AppState {
    data: DataState;
    interaction: InteractionState;

    deck: DeckState;
    currency: CurrencyState;
    format: FormatState;
}
