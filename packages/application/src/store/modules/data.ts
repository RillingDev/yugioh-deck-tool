import type { Module } from "vuex";
import type { AppState } from "../AppState";

export const ESSENTIAL_DATA_LOADED = "ESSENTIAL_DATA_LOADED";
export const SET_LOADING = "SET_LOADING";

export interface DataState {
    essentialDataLoaded: boolean;
    loading: boolean;
}

export const dataModule: Module<DataState, AppState> = {
    state: () => {
        return {
            essentialDataLoaded: false,
            loading: true,
        };
    },
    mutations: {
        [ESSENTIAL_DATA_LOADED](state) {
            state.essentialDataLoaded = true;
        },
        [SET_LOADING](state, payload: { loading: boolean }) {
            state.loading = payload.loading;
        },
    },
};
