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
import { DeckUriEncodingService } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItemButton } from "bootstrap-vue";
import { copyText } from "../../../../../ui/src/main";
import { appStore } from "../../../composition/appStore";
import { deckEmpty } from "../../../composition/deckEmpty";
import { showSuccess } from "../../../composition/feedback";

const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
    APPLICATION_TYPES.DeckUriEncodingService
);

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    setup: (props, context) => {
        const isDeckEmpty = deckEmpty(context);

        const copyLink = (): void => {
            const deck = appStore(context).state.deck.active;
            const queryParamValue = deckUriEncodingService.toUrlQueryParamValue(
                deck
            );
            const url = new URL(location.href);
            url.search = "";
            if (!isDeckEmpty.value) {
                url.searchParams.append("e", queryParamValue);
            }

            copyText(url.toString(), document);
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
