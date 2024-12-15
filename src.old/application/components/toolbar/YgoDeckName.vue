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

<script setup lang="ts">
import { computed } from "vue";
import { useId } from "@/application/composition/id";
import { useDeckStore } from "@/application/store/deck";

const deckStore = useDeckStore();
const deckName = computed({
	get: () => deckStore.deck.name,
	set: (newName) => (deckStore.deck.name = newName),
});
const deckNameId = useId();
</script>
