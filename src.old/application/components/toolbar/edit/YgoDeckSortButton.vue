<template>
	<BDropdownItemButton :disabled="deckEmpty" @click="() => sort()">
		<span class="fas fa-sort fas-in-button" aria-hidden="true"></span>
		Sort
	</BDropdownItemButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BDropdownItemButton } from "bootstrap-vue";
import { useDeckStore } from "@/application/store/deck";

const deckStore = useDeckStore();

const deckEmpty = computed(() => deckStore.deckEmpty);

const sort = (): void => deckStore.sort();
</script>
