<template>
    <div>
        <BDropdownItem @click="() => copyLink()">
            To Deck Tool Shareable Link in Clipboard
        </BDropdownItem>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DeckUriEncodingService } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItem } from "bootstrap-vue";
import { copyText } from "../../../../../ui/src/main";
import { appStore } from "../../../composition/appStore";
import { deckEmpty } from "../../../composition/deckEmpty";

const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
    APPLICATION_TYPES.DeckUriEncodingService
);

export default defineComponent({
    components: { BDropdownItem },
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
            context.root.$bvToast.toast(
                "Successfully copied share link to clipboard!",
                {
                    variant: "success",
                    noCloseButton: true,
                    toastClass: "deck-tool__portal",
                }
            );
        };

        return { copyLink };
    },
});
</script>
