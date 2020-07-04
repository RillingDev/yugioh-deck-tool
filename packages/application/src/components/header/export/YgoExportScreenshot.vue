<template>
    <BDropdownItem @click="() => screenshot()" v-b-modal.deckScreenshot>
        To Screenshot
        <BModal
            id="deckScreenshot"
            modal-class="deck-tool__portal"
            title="Deck Screenshot"
            hide-footer
            size="lg"
        >
            <div class="deck-screenshot">
                <img
                    :src="deckUri"
                    alt="Deck Screenshot"
                    class="deck-screenshot__image"
                />
            </div>
        </BModal>
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { getLogger } from "../../../../../core/src/main";
import { BDropdownItem, BModal } from "bootstrap-vue";
import { createScreenshot } from "../../../../../ui/src/main";
import { deckEmpty } from "../../../composition/deckEmpty";
import { showError } from "../../../composition/feedback";

const logger = getLogger("YgoExportScreenshot");

export default defineComponent({
    components: { BDropdownItem, BModal },
    props: {},
    setup: (props, context) => {
        const isDeckEmpty = deckEmpty(context);
        const deckUri = ref<string>();

        const screenshot = (): void => {
            const deckEl = document.getElementById("deckToolDeck");
            if (deckEl == null) {
                throw new TypeError("Could not get deck element!");
            }
            createScreenshot(deckEl)
                .then((dataUrl) => (deckUri.value = dataUrl))
                .catch((err) => {
                    logger.error("Could not create screenshot.", err);
                    showError(
                        context,
                        "Could not create screenshot.",
                        "deck-tool__portal"
                    );
                });
        };

        return { deckUri, isDeckEmpty, screenshot };
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
        max-width: 600px;
    }
}
</style>
