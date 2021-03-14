import type { CardCountFunction } from "../../../../core/src/main";
import type { Module } from "vuex";
import type { AppState } from "../AppState";

export const SET_CARD_COUNT_FUNCTION = "SET_CARD_COUNT_FUNCTION";

export interface CollectionState {
    cardCountFunction: CardCountFunction | null;
}

export const collectionModule: Module<CollectionState, AppState> = {
    state: () => {
        return {
            cardCountFunction: null,
        };
    },
    mutations: {
        [SET_CARD_COUNT_FUNCTION](
            state,
            payload: { cardCountFunction: CardCountFunction | null }
        ) {
            state.cardCountFunction = payload.cardCountFunction;
        },
    },
};
