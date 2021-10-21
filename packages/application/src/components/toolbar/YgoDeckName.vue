<template>
	<input
		v-model="deckName"
		class="form-control"
		title="Deck Name"
		placeholder="Deck Name"
		type="text"
	/>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { DECK_NAME_UPDATE } from "../../store/modules/deck";
import { useStore } from "../../store/store";

export default defineComponent({
	components: {},
	props: {},
	emits: [],
	setup() {
		const store = useStore();

		const deckName = computed<string | null>({
			get: () => store.state.deck.active.name,
			set: (newName) =>
				store.commit(DECK_NAME_UPDATE, {
					name: newName,
				}),
		});

		return { deckName };
	},
});
</script>
