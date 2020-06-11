import Vue from "vue";
import Vuex from "vuex";
import { DEVELOPMENT_MODE } from "../../../core/src/main";
import { currencyModule, CurrencyState } from "./modules/currency";
import { deckModule, DeckState } from "./modules/deck";
import { formatModule, FormatState } from "./modules/format";
import { dataModule, DataState } from "./modules/data";

Vue.use(Vuex);

export default new Vuex.Store<
    DataState & CurrencyState & FormatState & DeckState
>({
    modules: {
        data: dataModule,
        currency: currencyModule,
        format: formatModule,
        deck: deckModule,
    },
    strict: DEVELOPMENT_MODE,
});
