import { DeckPart, type Card, type Deck } from "@/core/lib";
import { defineStore } from "pinia";
import { deckService } from "@/application/ctx";
import { computed, ref } from "vue";

export const useDeckStore = defineStore("deck", () => {
	const deck = ref(deckService.createEmptyDeck());

	const deckEmpty = computed(
		() => deckService.getAllCards(deck.value).length === 0,
	);

	function replace(payload: { deck: Deck }) {
		deck.value = payload.deck;
	}
	function sort() {
		deck.value.parts = deckService.sort(deck.value).parts;
	}
	function shuffle() {
		deck.value.parts = deckService.shuffle(deck.value).parts;
	}
	function clear() {
		deck.value = deckService.createEmptyDeck();
	}

	// TODO use this to replace the following actions
	function replacePart(payload: { deckPart: DeckPart; newCards: Card[] }) {
		deck.value.parts[payload.deckPart] = payload.newCards;
	}
	function addCard(payload: {
		card: Card;
		deckPart: DeckPart;
		newIndex?: number;
	}) {
		deckService.addCard(
			deck.value,
			payload.card,
			payload.deckPart,
			payload.newIndex,
		);
	}
	function removeCard(payload: {
		card: Card;
		deckPart: DeckPart;
		oldIndex?: number;
	}) {
		deckService.removeCard(
			deck.value,
			payload.card,
			payload.deckPart,
			payload.oldIndex,
		);
	}

	function reorderCard(payload: {
		card: Card;
		deckPart: DeckPart;
		oldIndex: number;
		newIndex: number;
	}) {
		deckService.reorderCard(
			deck.value,
			payload.card,
			payload.deckPart,
			payload.oldIndex,
			payload.newIndex,
		);
	}

	return {
		deck,

		deckEmpty,

		replace,
		sort,
		shuffle,
		clear,

		replacePart,
		addCard,
		removeCard,
		reorderCard,
	};
});
