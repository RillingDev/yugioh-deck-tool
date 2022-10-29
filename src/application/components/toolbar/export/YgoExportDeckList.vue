<template>
	<BDropdownItemButton @click="() => copyList()">
		<span class="fas fa-paragraph fas-in-button" aria-hidden="true"></span>
		To Deck List in Clipboard
	</BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { DeckExportService } from "@/core/lib";
import { getLogger, TYPES } from "@/core/lib";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownItemButton } from "bootstrap-vue";
import { showError, showSuccess } from "../../../composition/feedback";
import { useStore } from "../../../store/store";

const deckExportService = applicationContainer.get<DeckExportService>(
	TYPES.DeckExportService
);

const logger = getLogger("YgoExportDeckList");

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup(props, context) {
		const store = useStore();

		const copyList = (): void => {
			const deck = store.state.deck.active;
			const deckList = deckExportService.toShareableText(deck);

			navigator.clipboard
				.writeText(deckList)
				.then(() =>
					showSuccess(
						context,
						"Successfully copied deck list to clipboard.",
						"deck-tool__portal"
					)
				)
				.catch((err) => {
					logger.error("Could not copy deck list!", err);
					showError(
						context,
						"Could not copy deck list.",
						"deck-tool__portal"
					);
				});
		};

		return { copyList };
	},
});
</script>
