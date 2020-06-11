import { Module } from "vuex";
import { Format } from "../../../../core/src/main";
import { AppState } from "../AppState";

export const FORMAT_UPDATE = "FORMAT_UPDATE";

export interface FormatState {
    active: Format;
}

export const formatModule: Module<FormatState, AppState> = {
    state: () => {
        return {
            active: Format.TCG,
        };
    },
    mutations: {
        [FORMAT_UPDATE](state, payload: { format: Format }) {
            state.active = payload.format;
        },
    },
};
