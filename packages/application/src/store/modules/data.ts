import { Module } from "vuex";
import { Format } from "yugioh-deck-tool-core/src/core/model/ygo/Format";

export const DATA_LOADED = "DATA_LOADED";

export interface DataState {
    loaded: boolean;
}

export const dataModule: Module<DataState, DataState> = {
    state: () => {
        return {
            loaded: false,
        };
    },
    mutations: {
        [DATA_LOADED](state) {
            state.loaded = true;
        },
    },
};
