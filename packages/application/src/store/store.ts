import Vue from "vue";
import Vuex from "vuex";
import { DEVELOPMENT_MODE } from "@yugioh-deck-tool/core";
import { currencyModule } from "./modules/currency";
import { deckModule } from "./modules/deck";
import { formatModule } from "./modules/format";
import { dataModule } from "./modules/data";
import type { AppState } from "./AppState";
import { collectionModule } from "./modules/collection";

Vue.use(Vuex);

export const store = new Vuex.Store<AppState>({
    modules: {
        data: dataModule,

        currency: currencyModule,
        format: formatModule,
        deck: deckModule,
        collection: collectionModule,
    },
    strict: DEVELOPMENT_MODE,
});
