import Vue from "vue";
import Vuex from "vuex";
import { DeckService, DEVELOPMENT_MODE } from "yugioh-deck-tool-core/src/main";
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";
import { currencyModule } from "@/store/modules/currency";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: { currency: currencyModule },
    strict: DEVELOPMENT_MODE,
});
