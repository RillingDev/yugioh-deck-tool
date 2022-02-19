import Vue from "vue";
import Vuex, { Store } from "vuex";
import { DEVELOPMENT_MODE } from "@/core/lib";
import { deckModule } from "./modules/deck";
import { formatModule } from "./modules/format";
import { dataModule } from "./modules/data";
import type { AppState } from "./AppState";
import { collectionModule } from "./modules/collection";

Vue.use(Vuex);

export const store = new Store<AppState>({
	modules: {
		data: dataModule,

		format: formatModule,
		deck: deckModule,
		collection: collectionModule,
	},
	strict: DEVELOPMENT_MODE,
});

// Prepare for Vuex4 (https://next.vuex.vuejs.org/guide/typescript-support.html#simplifying-usestore-usage)
export const useStore = (): typeof store => store;
