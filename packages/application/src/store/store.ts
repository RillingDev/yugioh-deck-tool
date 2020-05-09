import Vue from "vue";
import Vuex from "vuex";
import { DEVELOPMENT_MODE } from "yugioh-deck-tool-core/src/main";
import { currencyModule } from "@/store/modules/currency";
import { deckModule } from "./modules/deck";

Vue.use(Vuex);

export default new Vuex.Store<{}>({
    modules: { currency: currencyModule, deck: deckModule },
    strict: DEVELOPMENT_MODE,
});
