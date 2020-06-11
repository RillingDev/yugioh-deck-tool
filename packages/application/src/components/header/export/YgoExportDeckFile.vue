<template>
    <div>
        <BDropdownItem @click="() => downloadDeck()">
            To .ydk Deck File
        </BDropdownItem>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { DeckFileService, getLogger } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BAlert, BDropdownItem, BModal } from "bootstrap-vue";
import { readFile, saveFile } from "../../../../../ui/src/main";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { appStore } from "../../../composition/appStore";

const deckFileService = applicationContainer.get<DeckFileService>(
    APPLICATION_TYPES.DeckFileService
);

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: function (props, context) {
        const downloadDeck = (): void => {
            const deck = appStore(context).state.deck.active;
            const { fileContent, fileName } = deckFileService.toFile(deck);
            const file = new File([fileContent], fileName);
            saveFile(file, document);
        };

        return { downloadDeck };
    },
});
</script>
