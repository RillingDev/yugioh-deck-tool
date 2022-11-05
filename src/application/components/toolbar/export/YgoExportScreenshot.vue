<template>
	<BDropdownItemButton
		v-b-modal.deckScreenshot
		:disabled="deckEmpty"
		@click="() => screenshot()"
	>
		<span class="fas fa-image fas-in-button" aria-hidden="true"></span>
		To Screenshot
	</BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getLogger } from "@/core/lib";
import { BDropdownItemButton } from "bootstrap-vue";
import { downloadFile } from "../../../composition/io/downloadFile";
import { createScreenshot } from "../../../composition/io/createScreenshot";
import {
	showError,
	showInfo,
	showSuccess,
	useToast,
} from "../../../composition/feedback";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";

const logger = getLogger("YgoExportScreenshot");

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup() {
		const { deck, deckEmpty } = storeToRefs(useDeckStore());

		const toast = useToast();

		const screenshot = (): void => {
			const deckEl = document.getElementById("deckToolDeck");
			if (deckEl == null) {
				throw new TypeError("Could not get deck element!");
			}

			window.scrollTo(0, 0); // Reset scroll position as this may affect the screenshot rendering.

			showInfo(
				toast,
				"Creating screenshot, please wait.",
				"deck-tool__portal"
			);
			createScreenshot(deckEl, deck.value.name ?? "Deck Screenshot", {
				scale: 2,
				onclone: (doc) => {
					doc.body.classList.add("deck-tool__screenshot-context");
				},
				useCORS: true, // Image resources are hosted on separate origin.
			})
				.then((file) => {
					showSuccess(
						toast,
						"Screenshot created.",
						"deck-tool__portal"
					);
					downloadFile(file, document);
				})
				.catch((err) => {
					logger.error("Could not create screenshot!", err);
					showError(
						toast,
						"Could not create screenshot.",
						"deck-tool__portal"
					);
				});
		};

		return { deckEmpty, screenshot };
	},
});
</script>
