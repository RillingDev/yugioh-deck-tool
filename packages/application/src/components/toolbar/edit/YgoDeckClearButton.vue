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

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { DECK_CLEAR } from "../../../store/modules/deck";
import { BDropdownItemButton, BModal } from "bootstrap-vue";
import { useStore } from "../../../store/store";

export default defineComponent({
	components: {
		BModal,
		BDropdownItemButton,
	},
	props: {},
	emits: [],
	setup() {
		const store = useStore();

		const deckEmpty = computed<boolean>(() => store.getters.isDeckEmpty);

		const clear = (): void => store.commit(DECK_CLEAR);

		return { deckEmpty, clear };
	},
});
</script>
