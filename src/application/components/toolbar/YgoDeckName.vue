<template>
	<div class="form-group">
		<label :for="deckNameId">Deck Name</label>
		<input
			:id="deckNameId"
			v-model="deckName"
			class="form-control"
			placeholder="My Awesome Deck"
			type="text"
		/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { DECK_NAME_UPDATE } from "../../store/modules/deck";
import { useStore } from "../../store/store";
import { useId } from "@/application/composition/id";

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

		return { deckNameId: useId(), deckName };
	},
});
</script>
