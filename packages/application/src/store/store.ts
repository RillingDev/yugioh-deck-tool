import Vue from "vue";
import Vuex from "vuex";
import { DEVELOPMENT_MODE } from "../../../core/src/main";
import { currencyModule } from "./modules/currency";
import { deckModule } from "./modules/deck";
import { formatModule } from "./modules/format";
import { dataModule } from "./modules/data";
import type { AppState } from "./AppState";

Vue.use(Vuex);

export const store = new Vuex.Store<AppState>({
    modules: {
        data: dataModule,

        currency: currencyModule,
        format: formatModule,
        deck: deckModule,
    },
    strict: DEVELOPMENT_MODE,
});
