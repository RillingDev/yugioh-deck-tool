<template>
    <div>
        <BDropdownItem @click="() => copyYdke()">
            To YDKe URL in Clipboard
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

const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
    APPLICATION_TYPES.DeckUriEncodingService
);

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: function (props, context) {
        const copyYdke = (): void => {
            const deck = appStore(context).state.deck.active;
            const ydke = deckUriEncodingService.toUri(deck);
            copyText(ydke.toString(), document);
            context.root.$bvToast.toast(
                "Successfully copied YDKe to clipboard!",
                {
                    variant: "success",
                    noCloseButton: true,
                    toastClass: "deck-tool__portal",
                }
            );
        };

        return { copyYdke };
    },
});
</script>
