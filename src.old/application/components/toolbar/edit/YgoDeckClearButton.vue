<template>
	<BDropdownItemButton v-b-modal.clearDeck :disabled="deckEmpty">
		<span class="fas fa-trash fas-in-button" aria-hidden="true"></span>
		Clear
		<BModal
			id="clearDeck"
			modal-class="deck-tool__portal"
			title="Clear Deck"
			@ok="() => clear()"
		>
			<p>Are you sure you want to clear the deck?</p>
		</BModal>
	</BDropdownItemButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BDropdownItemButton, BModal } from "bootstrap-vue";
import { useDeckStore } from "@/application/store/deck";

const deckStore = useDeckStore();

const deckEmpty = computed(() => deckStore.deckEmpty);

const clear = (): void => deckStore.clear();
</script>
