<template>
    <BDropdownItem @click="() => copyYdke()">
        <span
            class="fas fa-external-link-alt fas-in-button"
            aria-hidden="true"
        ></span>
        To YDKe URL in Clipboard
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DeckUriEncodingService } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItem } from "bootstrap-vue";
import { copyText } from "../../../../../ui/src/main";
import { appStore } from "../../../composition/appStore";
import { showSuccess } from "../../../composition/feedback";

const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
    APPLICATION_TYPES.DeckUriEncodingService
);

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: (props, context) => {
        const copyYdke = (): void => {
            const deck = appStore(context).state.deck.active;
            const ydke = deckUriEncodingService.toUri(deck);
            copyText(ydke.toString(), document);
            showSuccess(
                context,
                "Successfully copied YDKe to clipboard!",
                "deck-tool__portal"
            );
        };

        return { copyYdke };
    },
});
</script>
