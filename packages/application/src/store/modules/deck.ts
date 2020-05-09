import { Module } from "vuex";
import {
    Card,
    Deck,
    DeckPart,
    DeckService,
} from "yugioh-deck-tool-core/src/main";
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

export const DECK_NAME_UPDATE = "DECK_NAME_UPDATE";

export const DECK_REPLACE = "DECK_REPLACE";
export const DECK_SORT = "DECK_SORT";
export const DECK_SHUFFLE = "DECK_SHUFFLE";

export const DECK_CARD_ADD = "DECK_CARD_ADD";
export const DECK_CARD_REMOVE = "DECK_CARD_REMOVE";

export interface DeckState {
    active: Deck;
}

/**
 * Deck state.
 *
 * NOTE: Vuex doesnt pick up on map modification, manual assignment is required.
 */
export const deckModule: Module<DeckState, DeckState> = {
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

        [DECK_CARD_ADD](state, payload: { deckPart: DeckPart; card: Card }) {
            state.active.parts = deckService.addCard(
                state.active,
                payload.deckPart,
                payload.card
            ).parts;
        },
        [DECK_CARD_REMOVE](state, payload: { deckPart: DeckPart; card: Card }) {
            state.active.parts = deckService.removeCard(
                state.active,
                payload.deckPart,
                payload.card
            ).parts;
        },
    },
};
