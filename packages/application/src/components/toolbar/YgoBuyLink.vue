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
import { computed, defineComponent } from "@vue/composition-api";
import type {
	DeckExportService,
	EnvironmentConfig,
} from "@yugioh-deck-tool/core";
import { Environment, TYPES } from "@yugioh-deck-tool/core";
import { applicationContainer } from "../../inversify.config";
import { useStore } from "../../store/store";

const deckExportService = applicationContainer.get<DeckExportService>(
	TYPES.DeckExportService
);
const environmentConfig = applicationContainer.get<EnvironmentConfig>(
	TYPES.EnvironmentConfig
);

export default defineComponent({
	components: {},
	props: {},
	emits: [],
	setup() {
		const store = useStore();

		const deckEmpty = computed<boolean>(() => store.getters.isDeckEmpty);

		const buyLink = computed<string>(() => {
			const deck = store.state.deck.active;
			const affiliate =
				environmentConfig.getEnvironment() == Environment.YGOPRODECK
					? {
							medium: "deck-builder",
							source: "YGOPRODeck",
					  }
					: null;
			return deckExportService.toBuyLink(deck, affiliate).toString();
		});

		return { deckEmpty, buyLink };
	},
});
</script>
