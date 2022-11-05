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
import type { DeckUriEncodingService } from "@/core/lib";
import { getLogger, TYPES } from "@/core/lib";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownItemButton } from "bootstrap-vue";
import {
	showError,
	showSuccess,
	useToast,
} from "../../../composition/feedback";
import { useDeckStore } from "@/application/store/deck";

const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
	TYPES.DeckUriEncodingService
);

const logger = getLogger("YgoExportDeckYdkeUrl");

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup() {
		const deckStore = useDeckStore();
		const toast = useToast();

		const copyYdke = (): void => {
			const ydke = deckUriEncodingService.toUri(deckStore.active);

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
