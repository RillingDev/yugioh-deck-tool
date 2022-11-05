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
import {
	showError,
	showSuccess,
	useToast,
} from "../../../composition/feedback";
import { useDeckStore } from "@/application/store/deck";

const deckExportService = applicationContainer.get<DeckExportService>(
	TYPES.DeckExportService
);

const logger = getLogger("YgoExportDeckList");

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup() {
		const deckStore = useDeckStore();
		const toast = useToast();

		const copyList = (): void => {
			const deckList = deckExportService.toShareableText(
				deckStore.active
			);

			navigator.clipboard
				.writeText(deckList)
				.then(() =>
					showSuccess(
						toast,
						"Successfully copied deck list to clipboard.",
						"deck-tool__portal"
					)
				)
				.catch((err) => {
					logger.error("Could not copy deck list!", err);
					showError(
						toast,
						"Could not copy deck list.",
						"deck-tool__portal"
					);
				});
		};

		return { copyList };
	},
});
</script>
