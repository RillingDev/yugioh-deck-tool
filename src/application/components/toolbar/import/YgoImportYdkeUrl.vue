<template>
	<BDropdownItemButton v-b-modal.ydkeImport>
		<span
			class="fas fa-external-link-alt fas-in-button"
			aria-hidden="true"
		></span>
		From YDKe URL
		<BModal
			id="ydkeImport"
			ref="modal"
			modal-class="deck-tool__portal"
			title="Import Deck From YDKe URL"
			hide-footer
			@hide="() => onHide()"
		>
			<div class="form-group">
				<label :for="ydkeUrlId">YDKe URL</label>
				<input
					:id="ydkeUrlId"
					v-model="ydkeUrl"
					autofocus
					type="text"
					class="form-control"
					placeholder="ydke://o6lXBQ==!d5uTAg==!!"
					@input="() => onInput()"
				/>
			</div>
		</BModal>
	</BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { Deck } from "@/core/lib";
import { getLogger } from "@/core/lib";
import { BDropdownItemButton, BModal } from "bootstrap-vue";
import {
	showError,
	showSuccess,
	useToast,
} from "../../../composition/feedback";
import { useId } from "@/application/composition/id";
import { useDeckStore } from "@/application/store/deck";
import { deckUriEncodingService } from "@/application/container";

const logger = getLogger("YgoImportYdkeUrl");

export default defineComponent({
	components: { BDropdownItemButton, BModal },
	props: {},
	emits: [],
	setup() {
		const deckStore = useDeckStore();

		const toast = useToast();

		const modal = ref<BModal>();
		const ydkeUrl = ref<string>("");

		const onInput = (): void => {
			let deck: Deck;
			try {
				deck = deckUriEncodingService.fromUri(ydkeUrl.value);
			} catch (e) {
				logger.error("Could not read YDKe URL!", e);
				showError(
					toast,
					"Could not read YDKe URL.",
					"deck-tool__portal"
				);
				return;
			}
			deckStore.replace({
				deck,
			});
			showSuccess(
				toast,
				"Successfully imported YDKe URL.",
				"deck-tool__portal"
			);
			modal.value!.hide();
		};
		const onHide = (): void => {
			ydkeUrl.value = "";
		};

		return {
			ydkeUrlId: useId(),

			ydkeUrl,

			modal,

			onInput,
			onHide,
		};
	},
});
</script>
