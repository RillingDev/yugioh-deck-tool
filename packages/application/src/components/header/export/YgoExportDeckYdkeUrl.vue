<template>
    <div>
        <BDropdownItem @click="() => copyYdke()">
            To YDKe URL in Clipboard
        </BDropdownItem>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import {
    DeckFileService,
    getLogger,
    DeckUriEncodingService,
} from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItem, BModal } from "bootstrap-vue";
import { readFile, saveFile, copyText } from "../../../../../ui/src/main";
import { DECK_REPLACE } from "../../../store/modules/deck";
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
        };

        return { copyYdke };
    },
});
</script>
