<template>
	<BDropdownItemButton @click="() => downloadDeck()">
		<span class="fas fa-file fas-in-button" aria-hidden="true"></span>
		To .ydk Deck File
	</BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DeckFileService } from "@/core/lib";
import { BDropdownItemButton } from "bootstrap-vue";
import { downloadFile } from "../../../composition/io/downloadFile";
import { showSuccess, useToast } from "../../../composition/feedback";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckFileService } from "@/application/container";

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup() {
		const toast = useToast();
		const { deck } = storeToRefs(useDeckStore());

		const downloadDeck = (): void => {
			const { fileContent, fileName } = deckFileService.toFile(
				deck.value
			);
			const file = new File([fileContent], fileName, {
				type: DeckFileService.DECK_FILE_MIME_TYPE,
			});
			downloadFile(file, document);
			showSuccess(
				toast,
				"Successfully exported deck file.",
				"deck-tool__portal"
			);
		};

		return { downloadDeck };
	},
});
</script>
