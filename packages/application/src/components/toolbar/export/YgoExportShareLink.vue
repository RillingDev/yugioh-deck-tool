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
import { copyText } from "../../../../../ui/src/main";
import { appStore } from "../../../composition/state/appStore";
import { showSuccess } from "../../../composition/feedback";
import type { DeckUrlController } from "../../../controller/DeckUrlController";

const deckUrlController = applicationContainer.get<DeckUrlController>(
    APPLICATION_TYPES.DeckUrlController
);

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    setup(props, context) {
        const copyLink = (): void => {
            const deck = appStore(context).state.deck.active;
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
