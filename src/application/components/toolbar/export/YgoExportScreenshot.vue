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
import { computed, defineComponent } from "@vue/composition-api";
import { getLogger } from "@/core/lib";
import { BDropdownItemButton } from "bootstrap-vue";
import { createScreenshot, downloadFile } from "@/browser-common/lib";
import {
	showError,
	showInfo,
	showSuccess,
} from "../../../composition/feedback";
import { useStore } from "../../../store/store";

const logger = getLogger("YgoExportScreenshot");

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup(props, context) {
		const store = useStore();

		const deckEmpty = computed<boolean>(() => store.getters.isDeckEmpty);

		const screenshot = (): void => {
			const deckEl = document.getElementById("deckToolDeck");
			if (deckEl == null) {
				throw new TypeError("Could not get deck element!");
			}

			window.scrollTo(0, 0); // Reset scroll position as this may affect the screenshot rendering.

			showInfo(
				context,
				"Creating screenshot, please wait.",
				"deck-tool__portal"
			);
			createScreenshot(
				deckEl,
				store.state.deck.active.name ?? "Deck Screenshot",
				{
					scale: 2,
					onclone: (doc) => {
						doc.body.classList.add("deck-tool__screenshot-context");
					},
					useCORS: true, // Image resources are hosted on separate origin.
				}
			)
				.then((file) => {
					showSuccess(
						context,
						"Screenshot created.",
						"deck-tool__portal"
					);
					downloadFile(file, document);
				})
				.catch((err) => {
					logger.error("Could not create screenshot!", err);
					showError(
						context,
						"Could not create screenshot.",
						"deck-tool__portal"
					);
				});
		};

		return { deckEmpty, screenshot };
	},
});
</script>
