<template>
	<BDropdownItemButton @click="() => copyLink()">
		<span
			class="fas fa-share-square fas-in-button"
			aria-hidden="true"
		></span>
		To Shareable Link in Clipboard
	</BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BDropdownItemButton } from "bootstrap-vue";
import {
	showError,
	showSuccess,
	useToast,
} from "../../../composition/feedback";
import { getLogger } from "@/core/lib";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckUrlController } from "@/application/container";

const logger = getLogger("YgoExportShareLink");

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup() {
		const { deck } = storeToRefs(useDeckStore());

		const toast = useToast();

		const copyLink = (): void => {
			const shareLink = deckUrlController.getShareLink(deck.value);

			navigator.clipboard
				.writeText(shareLink.toString())
				.then(() =>
					showSuccess(
						toast,
						"Successfully copied share link to clipboard.",
						"deck-tool__portal"
					)
				)
				.catch((err) => {
					logger.error("Could not copy share link!", err);
					showError(
						toast,
						"Could not copy share link.",
						"deck-tool__portal"
					);
				});
		};

		return { copyLink };
	},
});
</script>
