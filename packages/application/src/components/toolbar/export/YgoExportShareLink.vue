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
import { copyText } from "../../../../../browser-common/src/main";
import { useAppStore } from "../../../composition/state/useAppStore";
import { showSuccess } from "../../../composition/feedback";
import type { DeckUrlController } from "../../../controller/DeckUrlController";

const deckUrlController = applicationContainer.get<DeckUrlController>(
    APPLICATION_TYPES.DeckUrlController
);

export default defineComponent({
    props: {},
    emits: [],
    components: { BDropdownItemButton },
    setup(props, context) {
        const copyLink = (): void => {
            const deck = useAppStore(context).state.deck.active;
            const shareLink = deckUrlController.getShareLink(deck);
            copyText(shareLink.toString(), document);
            showSuccess(
                context,
                "Successfully copied share link to clipboard.",
                "deck-tool__portal"
            );
        };

        return { copyLink };
    },
});
</script>
