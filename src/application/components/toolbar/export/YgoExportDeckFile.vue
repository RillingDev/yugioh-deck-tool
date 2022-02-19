<template>
	<BDropdownItemButton @click="() => downloadDeck()">
		<span class="fas fa-file fas-in-button" aria-hidden="true"></span>
		To .ydk Deck File
	</BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DeckFileService, TYPES } from "@/core/lib";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownItemButton } from "bootstrap-vue";
import { downloadFile } from "@/browser-common/lib";
import { showSuccess } from "../../../composition/feedback";
import { useStore } from "../../../store/store";

const deckFileService = applicationContainer.get<DeckFileService>(
	TYPES.DeckFileService
);

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup(props, context) {
		const store = useStore();

		const downloadDeck = (): void => {
			const deck = store.state.deck.active;
			const { fileContent, fileName } = deckFileService.toFile(deck);
			const file = new File([fileContent], fileName, {
				type: DeckFileService.DECK_FILE_MIME_TYPE,
			});
			downloadFile(file, document);
			showSuccess(
				context,
				"Successfully exported deck file.",
				"deck-tool__portal"
			);
		};

		return { downloadDeck };
	},
});
</script>
