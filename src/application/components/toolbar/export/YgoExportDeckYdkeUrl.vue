<template>
	<BDropdownItemButton @click="() => copyYdke()">
		<span
			class="fas fa-external-link-alt fas-in-button"
			aria-hidden="true"
		></span>
		To YDKe URL in Clipboard
	</BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getLogger } from "@/core/lib";
import { BDropdownItemButton } from "bootstrap-vue";
import {
	showError,
	showSuccess,
	useToast,
} from "../../../composition/feedback";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckUriEncodingService } from "@/application/container";

const logger = getLogger("YgoExportDeckYdkeUrl");

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup() {
		const { deck } = storeToRefs(useDeckStore());

		const toast = useToast();

		const copyYdke = (): void => {
			const ydke = deckUriEncodingService.toUri(deck.value);

			navigator.clipboard
				.writeText(ydke.toString())
				.then(() =>
					showSuccess(
						toast,
						"Successfully copied YDKe to clipboard.",
						"deck-tool__portal"
					)
				)
				.catch((err) => {
					logger.error("Could not copy YDKe!", err);
					showError(
						toast,
						"Could not copy YDKe.",
						"deck-tool__portal"
					);
				});
		};

		return { copyYdke };
	},
});
</script>
