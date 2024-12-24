<template>
	<VBtn
		:href="buyLink"
		:disabled="deckEmpty"
		prepend-icon="fas fa-shopping-cart"
		color="primary"
		variant="outlined"
	>
		Buy
	</VBtn>
</template>

<script setup lang="ts">
import { deckExportService, environmentConfig } from "@/application/ctx";
import { useDeckStore } from "@/application/store/deck";
import { Environment } from "@/core/lib";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { VBtn } from "vuetify/components/VBtn";

const { deck, deckEmpty } = storeToRefs(useDeckStore());

const buyLink = computed(() => {
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
