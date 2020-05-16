import Vue from "vue";
import Vuex from "vuex";
import { DEVELOPMENT_MODE } from "yugioh-deck-tool-core/src/main";
import { currencyModule } from "./modules/currency";
import { deckModule } from "./modules/deck";
import { formatModule } from "./modules/format";

Vue.use(Vuex);

export default new Vuex.Store<{}>({
    modules: {
        currency: currencyModule,
        deck: deckModule,
        format: formatModule,
    },
    strict: DEVELOPMENT_MODE,
});
