<template>
    <div>
        <BDropdownItem v-b-modal.ydkeImport>
            From YDKe URL
        </BDropdownItem>
        <BModal
            ref="modal"
            id="ydkeImport"
            modal-class="deck-tool__portal"
            title="Import Deck From YDKe URL"
            hide-footer
        >
            <div class="form-group">
                <input
                    type="text"
                    class="form-control"
                    title="YDKe URL"
                    placeholder="YDKe URL"
                    v-model="ydkeUrl"
                    @input="() => onInput()"
                />
            </div>
        </BModal>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import {
    DeckUriEncodingService,
    getLogger,
    Deck,
} from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItem, BModal } from "bootstrap-vue";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { appStore } from "../../../composition/appStore";

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
                context.root.$bvToast.toast("Could not read YDKe URL.", {
                    variant: "error",
                    noCloseButton: true,
                    toastClass: "deck-tool__portal",
                });
                return;
            }
            appStore(context).commit(DECK_REPLACE, {
                deck,
            });
            context.root.$bvToast.toast("Successfully imported YDKe URL!", {
                variant: "success",
                noCloseButton: true,
                toastClass: "deck-tool__portal",
            });
            modal.value!.close();
        };

        return { modal, onInput, ydkeUrl };
    },
});
</script>
