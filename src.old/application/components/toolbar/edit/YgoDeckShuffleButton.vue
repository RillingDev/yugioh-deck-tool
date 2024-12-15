<template>
	<BDropdownItemButton :disabled="deckEmpty" @click="() => shuffle()">
		<span class="fas fa-random fas-in-button" aria-hidden="true"></span>
		Shuffle
	</BDropdownItemButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BDropdownItemButton } from "bootstrap-vue";
import { useDeckStore } from "@/application/store/deck";

const deckStore = useDeckStore();

const deckEmpty = computed(() => deckStore.deckEmpty);

const shuffle = (): void => deckStore.shuffle();
</script>
