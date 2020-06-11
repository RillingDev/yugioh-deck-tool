import { Module } from "vuex";
import { AppState } from "../AppState";

export const DATA_LOADED = "DATA_LOADED";

export interface DataState {
    loaded: boolean;
}

export const dataModule: Module<DataState, AppState> = {
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
