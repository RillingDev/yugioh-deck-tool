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
import type { Deck, DeckUriEncodingService } from "@/core/lib";
import { getLogger, TYPES } from "@/core/lib";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownItemButton, BModal } from "bootstrap-vue";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { showError, showSuccess } from "../../../composition/feedback";
import { useStore } from "../../../store/store";
import { useId } from "@/application/composition/id";

const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
	TYPES.DeckUriEncodingService
);

const logger = getLogger("YgoImportYdkeUrl");

export default defineComponent({
	components: { BDropdownItemButton, BModal },
	props: {},
	emits: [],
	setup(props, context) {
		const modal = ref<BModal>();
		const ydkeUrl = ref<string>("");

		const store = useStore();

		const onInput = (): void => {
			let deck: Deck;
			try {
				deck = deckUriEncodingService.fromUri(ydkeUrl.value);
			} catch (e) {
				logger.error("Could not read YDKe URL!", e);
				showError(
					context,
					"Could not read YDKe URL.",
					"deck-tool__portal"
				);
				return;
			}
			store.commit(DECK_REPLACE, {
				deck,
			});
			showSuccess(
				context,
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
