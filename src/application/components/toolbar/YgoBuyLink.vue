<template>
	<VBtn
		:disabled="deckEmpty"
		:href="buyLink"
		prepend-icon="fas fa-shopping-cart"
		size="small"
	>
		Buy Deck
	</VBtn>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Environment } from "@/core/lib";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckExportService, environmentConfig } from "@/application/ctx";
import { VBtn } from "vuetify/components/VBtn";

const { deck, deckEmpty } = storeToRefs(useDeckStore());

const buyLink = computed<string>(() => {
	const affiliate =
		environmentConfig.getEnvironment() == Environment.YGOPRODECK
			? {
					medium: "deck-builder",
					source: "YGOPRODeck",
				}
			: null;
	return deckExportService.toBuyLink(deck.value, affiliate).toString();
});
</script>
