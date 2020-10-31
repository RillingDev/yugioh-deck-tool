import type { Module } from "vuex";
import { Format } from "../../../../core/src/main";
import type { AppState } from "../AppState";

export const FORMAT_UPDATE = "FORMAT_UPDATE";

export interface FormatState {
    active: Format | null;
}

export const formatModule: Module<FormatState, AppState> = {
    state: () => {
        return {
            active: null,
        };
    },
    mutations: {
        [FORMAT_UPDATE](state, payload: { format: Format | null }) {
            state.active = payload.format;
        },
    },
};
