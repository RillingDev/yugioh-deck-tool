import type { Card, Deck, DeckPart, DeckService } from "@/core/lib";
import { TYPES } from "@/core/lib";
import { applicationContainer } from "../inversify.config";
import { defineStore } from "pinia";

const deckService = applicationContainer.get<DeckService>(TYPES.DeckService);

interface DeckState {
	active: Deck;
}

export const useDeckStore = defineStore("deck", {
	state(): DeckState {
		return {
			active: deckService.createEmptyDeck(),
		};
	},
	getters: {
		isDeckEmpty: (state) =>
			deckService.getAllCards(state.active).length === 0,
	},
	actions: {
		setName(payload: { name: string | null }) {
			this.active.name = payload.name;
		},

		replace(payload: { deck: Deck }) {
			this.active = payload.deck;
		},
		sort() {
			this.active.parts = deckService.sort(this.active).parts;
		},
		shuffle() {
			this.active.parts = deckService.shuffle(this.active).parts;
		},
		clear() {
			this.active = deckService.createEmptyDeck();
		},

		addCard(payload: {
			card: Card;
			deckPart: DeckPart;
			newIndex?: number;
		}) {
			deckService.addCard(
				this.active,
				payload.card,
				payload.deckPart,
				payload.newIndex
			);
		},
		removeCard(payload: {
			card: Card;
			deckPart: DeckPart;
			oldIndex?: number;
		}) {
			deckService.removeCard(
				this.active,
				payload.card,
				payload.deckPart,
				payload.oldIndex
			);
		},
		reorderCard(payload: {
			card: Card;
			deckPart: DeckPart;
			oldIndex: number;
			newIndex: number;
		}) {
			deckService.reorderCard(
				this.active,
				payload.card,
				payload.deckPart,
				payload.oldIndex,
				payload.newIndex
			);
		},
	},
});
