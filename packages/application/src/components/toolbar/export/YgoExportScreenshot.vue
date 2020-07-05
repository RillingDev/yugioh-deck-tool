<template>
    <BDropdownItem @click="() => screenshot()" v-b-modal.deckScreenshot>
        <span class="fas fa-image fas-in-button" aria-hidden="true"></span>
        To Screenshot
        <BModal
            id="deckScreenshot"
            modal-class="deck-tool__portal"
            title="Deck Screenshot"
            hide-footer
            size="lg"
        >
            <BOverlay :show="deckUri == null">
                <div class="deck-screenshot">
                    <img
                        :src="deckUri"
                        alt="Deck Screenshot"
                        class="deck-screenshot__image"
                    />
                </div>
            </BOverlay>
        </BModal>
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { getLogger } from "../../../../../core/src/main";
import { BDropdownItem, BModal, BOverlay } from "bootstrap-vue";
import { createScreenshot } from "../../../../../ui/src/main";
import { deckEmpty } from "../../../composition/deckEmpty";
import { showError } from "../../../composition/feedback";

const logger = getLogger("YgoExportScreenshot");

export default defineComponent({
    components: { BDropdownItem, BModal, BOverlay },
    props: {},
    setup: (props, context) => {
        const isDeckEmpty = deckEmpty(context);
        const deckUri = ref<string | null>(null);
        const screenshotReady = ref<boolean>(false);

        const screenshot = (): void => {
            deckUri.value = null;
            const deckEl = document.getElementById("deckToolDeck");
            if (deckEl == null) {
                throw new TypeError("Could not get deck element!");
            }
            createScreenshot(deckEl)
                .then((dataUrl) => {
                    deckUri.value = dataUrl;
                })
                .catch((err) => {
                    logger.error("Could not create screenshot.", err);
                    showError(
                        context,
                        "Could not create screenshot.",
                        "deck-tool__portal"
                    );
                });
        };

        return { deckUri, isDeckEmpty, screenshotReady, screenshot };
    },
});
</script>
<style lang="scss">
@import "../../../../../ui/src/styles/variables";
.deck-tool,
.deck-tool__portal {
    .deck-screenshot {
        display: flex;
        padding: 1rem;
        background-color: $gray-200;
        justify-content: center;
    }
    .deck-screenshot__image {
        max-width: 660px;
        max-height: 820px;
    }
}
</style>
