import { Module } from "vuex";
import { AppState } from "../AppState";

export const INTERACTION_DRAGGING_START = "INTERACTION_DRAGGING_START";
export const INTERACTION_DRAGGING_STOP = "INTERACTION_DRAGGING_STOP";

export interface InteractionState {
    dragging: boolean;
}

export const interactionModule: Module<InteractionState, AppState> = {
    state: () => {
        return {
            dragging: false,
        };
    },
    mutations: {
        [INTERACTION_DRAGGING_START](state) {
            state.dragging = true;
        },
        [INTERACTION_DRAGGING_STOP](state) {
            state.dragging = false;
        },
    },
};
