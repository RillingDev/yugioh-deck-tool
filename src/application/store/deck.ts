import { DeckPart, type Card, type Deck } from "@/core/lib";
import { defineStore } from "pinia";
import { deckService } from "@/application/ctx";

interface DeckState {
	deck: Deck;
}

export const useDeckStore = defineStore("deck", {
	state(): DeckState {
		return {
			deck: deckService.createEmptyDeck(),
		};
	},
	getters: {
		deckEmpty: (state) => deckService.getAllCards(state.deck).length === 0,
	},
	actions: {
		replace(payload: { deck: Deck }) {
			this.deck = payload.deck;
		},
		sort() {
			this.deck.parts = deckService.sort(this.deck).parts;
		},
		shuffle() {
			this.deck.parts = deckService.shuffle(this.deck).parts;
		},
		clear() {
			this.deck = deckService.createEmptyDeck();
		},

		// TODO use this to replace the following actions
		replacePart(payload: { deckPart: DeckPart; newCards: Card[] }) {
			this.deck.parts[payload.deckPart] = payload.newCards;
		},
		addCard(payload: {
			card: Card;
			deckPart: DeckPart;
			newIndex?: number;
		}) {
			deckService.addCard(
				this.deck,
				payload.card,
				payload.deckPart,
				payload.newIndex,
			);
		},
		removeCard(payload: {
			card: Card;
			deckPart: DeckPart;
			oldIndex?: number;
		}) {
			deckService.removeCard(
				this.deck,
				payload.card,
				payload.deckPart,
				payload.oldIndex,
			);
		},
		reorderCard(payload: {
			card: Card;
			deckPart: DeckPart;
			oldIndex: number;
			newIndex: number;
		}) {
			deckService.reorderCard(
				this.deck,
				payload.card,
				payload.deckPart,
				payload.oldIndex,
				payload.newIndex,
			);
		},
	},
});
