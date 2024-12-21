<template>
	<VTextField
		v-model="deckName"
		label="Deck Name"
		placeholder="My Awesome Deck"
	/>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDeckStore } from "@/application/store/deck";
import { VTextField } from "vuetify/components/VTextField";

const deckStore = useDeckStore();

const deckName = computed({
	get: () => deckStore.deck.name,
	set: (newName) => (deckStore.deck.name = newName),
});
</script>
