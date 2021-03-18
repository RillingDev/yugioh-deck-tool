import type { Module } from "vuex";
import type { AppState } from "../AppState";

export const SET_DATA_LOADED = "SET_DATA_LOADED";

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
        [SET_DATA_LOADED](state, payload: { loaded: boolean }) {
            state.loaded = payload.loaded;
        },
    },
};
