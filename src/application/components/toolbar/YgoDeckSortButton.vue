<template>
	<VBtn
		:disabled="deckEmpty"
		prepend-icon="fas fa-sort"
		color="primary"
		variant="outlined"
		@click="sort"
	>
		Sort
	</VBtn>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VBtn } from "vuetify/components/VBtn";
import { useDeckStore } from "@/application/store/deck";

const deckStore = useDeckStore();

const deckEmpty = computed(() => deckStore.deckEmpty);

function sort() {
	deckStore.sort();
}
</script>
