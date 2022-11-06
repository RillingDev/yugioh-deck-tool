<template>
	<a
		:disabled="deckEmpty"
		:class="{ disabled: deckEmpty }"
		:href="buyLink"
		class="btn btn-primary"
		target="_blank"
		rel="noopener noreferrer"
	>
		<span
			class="fas fas-in-button fa-shopping-cart"
			aria-hidden="true"
		></span>
		Buy Deck
	</a>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { Environment } from "@/core/lib";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckExportService, environmentConfig } from "@/application/container";

export default defineComponent({
	components: {},
	props: {},
	emits: [],
	setup() {
		const { deck, deckEmpty } = storeToRefs(useDeckStore());

		const buyLink = computed<string>(() => {
			const affiliate =
				environmentConfig.getEnvironment() == Environment.YGOPRODECK
					? {
							medium: "deck-builder",
							source: "YGOPRODeck",
					  }
					: null;
			return deckExportService
				.toBuyLink(deck.value, affiliate)
				.toString();
		});

		return { deckEmpty, buyLink };
	},
});
</script>
