import { Module } from "vuex";
import { Card, Deck, DeckPart, DeckService } from "yugioh-deck-tool-core";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

export const DECK_NAME_UPDATE = "DECK_NAME_UPDATE";

export const DECK_REPLACE = "DECK_REPLACE";
export const DECK_SORT = "DECK_SORT";
export const DECK_SHUFFLE = "DECK_SHUFFLE";

export const DECK_CARDS_REPLACE = "DECK_CARDS_REPLACE";

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
        [DECK_CARDS_REPLACE](
            state,
            payload: { deckPart: DeckPart; cards: Card[] }
        ) {
            state.active.parts[payload.deckPart] = payload.cards;
        },
    },
};
