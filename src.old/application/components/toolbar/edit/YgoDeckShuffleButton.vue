<template>
	<BDropdownItemButton :disabled="deckEmpty" @click="() => shuffle()">
		<span class="fas fa-random fas-in-button" aria-hidden="true"></span>
		Shuffle
	</BDropdownItemButton>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { BDropdownItemButton } from "bootstrap-vue";
import { useDeckStore } from "@/application/store/deck";

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup() {
		const deckStore = useDeckStore();

		const deckEmpty = computed(() => deckStore.deckEmpty);

		const shuffle = (): void => deckStore.shuffle();

		return { deckEmpty, shuffle };
	},
});
</script>
