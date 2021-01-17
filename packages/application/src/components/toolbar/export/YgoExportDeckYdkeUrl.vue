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
import { defineComponent } from "@vue/composition-api";
import type { DeckUriEncodingService } from "../../../../../core/src/main";
import { TYPES } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownItemButton } from "bootstrap-vue";
import { copyText } from "../../../../../ui/src/main";
import { appStore } from "../../../composition/state/appStore";
import { showSuccess } from "../../../composition/feedback";

const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
    TYPES.DeckUriEncodingService
);

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    setup(props, context) {
        const copyYdke = (): void => {
            const deck = appStore(context).state.deck.active;
            const ydke = deckUriEncodingService.toUri(deck);
            copyText(ydke.toString(), document);
            showSuccess(
                context,
                "Successfully copied YDKe to clipboard.",
                "deck-tool__portal"
            );
        };

        return { copyYdke };
    },
});
</script>
