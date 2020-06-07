import Vue from "vue";
import Vuex from "vuex";
import { DEVELOPMENT_MODE } from "../../../core/src/main";
import { currencyModule } from "./modules/currency";
import { deckModule } from "./modules/deck";
import { formatModule } from "./modules/format";
import { dataModule } from "./modules/data";

Vue.use(Vuex);

export default new Vuex.Store<{}>({
    modules: {
        data: dataModule,
        currency: currencyModule,
        format: formatModule,
        deck: deckModule,
    },
    strict: DEVELOPMENT_MODE,
});
