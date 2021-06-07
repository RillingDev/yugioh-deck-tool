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
import { defineComponent } from "@vue/composition-api";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItemButton } from "bootstrap-vue";
import { showError, showSuccess } from "../../../composition/feedback";
import type { DeckUrlController } from "../../../controller/DeckUrlController";
import { getLogger } from "../../../../../core/src/logger";
import { useStore } from "../../../store/store";

const deckUrlController = applicationContainer.get<DeckUrlController>(
    APPLICATION_TYPES.DeckUrlController
);

const logger = getLogger("YgoExportShareLink");

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    emits: [],
    setup(props, context) {
        const copyLink = (): void => {
            const deck = useStore().state.deck.active;
            const shareLink = deckUrlController.getShareLink(deck);

            navigator.clipboard
                .writeText(shareLink.toString())
                .then(() =>
                    showSuccess(
                        context,
                        "Successfully copied share link to clipboard.",
                        "deck-tool__portal"
                    )
                )
                .catch((err) => {
                    logger.error("Could not copy share link!", err);
                    showError(
                        context,
                        "Could not copy share link.",
                        "deck-tool__portal"
                    );
                });
        };

        return { copyLink };
    },
});
</script>
