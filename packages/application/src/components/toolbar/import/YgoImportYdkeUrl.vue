<template>
    <BDropdownItem v-b-modal.ydkeImport>
        <span
            class="fas fa-external-link-alt fas-in-button"
            aria-hidden="true"
        ></span>
        From YDKe URL
        <BModal
            ref="modal"
            id="ydkeImport"
            modal-class="deck-tool__portal"
            title="Import Deck From YDKe URL"
            hide-footer
            @hide="() => onHide()"
        >
            <div class="form-group">
                <input
                    autofocus
                    type="text"
                    class="form-control"
                    title="YDKe URL"
                    placeholder="YDKe URL"
                    v-model="ydkeUrl"
                    @input="() => onInput()"
                />
            </div>
        </BModal>
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import {
    Deck,
    DeckUriEncodingService,
    getLogger,
} from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItem, BModal } from "bootstrap-vue";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { appStore } from "../../../composition/appStore";
import { showError, showSuccess } from "../../../composition/feedback";

const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
    APPLICATION_TYPES.DeckUriEncodingService
);

const logger = getLogger("YgoImportYdkeUrl");

export default defineComponent({
    components: { BDropdownItem, BModal },
    props: {},
    setup: function (props, context) {
        const modal = ref<BModal>();
        const ydkeUrl = ref<string>("");

        const onInput = (): void => {
            let deck: Deck;
            try {
                deck = deckUriEncodingService.fromUri(ydkeUrl.value);
            } catch (e) {
                logger.error("Could not read YDKe URL.", e);
                showError(
                    context,
                    "Could not read YDKe URL.",
                    "deck-tool__portal"
                );
                return;
            }
            appStore(context).commit(DECK_REPLACE, {
                deck,
            });
            showSuccess(
                context,
                "Successfully imported YDKe URL!",
                "deck-tool__portal"
            );
            modal.value!.hide();
        };
        const onHide = (): void => {
            ydkeUrl.value = "";
        };

        return { ydkeUrl, modal, onInput, onHide };
    },
});
</script>
