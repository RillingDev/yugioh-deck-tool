import { Module } from "vuex";
import { Card, Deck, DeckPart, DeckService } from "../../../../core/src/main";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import { AppState } from "../AppState";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

export const DECK_NAME_UPDATE = "DECK_NAME_UPDATE";

export const DECK_REPLACE = "DECK_REPLACE";
export const DECK_SORT = "DECK_SORT";
export const DECK_SHUFFLE = "DECK_SHUFFLE";
export const DECK_CLEAR = "DECK_CLEAR";

export const DECK_PART_CARDS_REPLACE = "DECK_PART_CARDS_REPLACE";

export interface DeckState {
    active: Deck;
}

export const deckModule: Module<DeckState, AppState> = {
    state: () => {
        return {
            active: deckService.createEmptyDeck(),
        };
    },
    mutations: {
        [DECK_NAME_UPDATE](state, payload: { name: string }) {
            state.active.name = payload.name;
        },

        [DECK_REPLACE](state, payload: { deck: Deck }) {
            state.active = payload.deck;
        },
        [DECK_SORT](state) {
            state.active.parts = deckService.sort(state.active).parts;
        },
        [DECK_SHUFFLE](state) {
            state.active.parts = deckService.shuffle(state.active).parts;
        },
        [DECK_CLEAR](state) {
            state.active.name = "";
            state.active.parts = deckService.createEmptyDeck().parts;
        },

        [DECK_PART_CARDS_REPLACE](
            state,
            payload: { deckPart: DeckPart; cards: Card[] }
        ) {
            state.active.parts[payload.deckPart] = payload.cards;
        },
    },
};
