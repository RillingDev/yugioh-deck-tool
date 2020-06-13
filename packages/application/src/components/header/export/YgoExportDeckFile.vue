<template>
    <div>
        <BDropdownItem @click="() => downloadDeck()">
            To .ydk Deck File
        </BDropdownItem>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DeckFileService } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItem } from "bootstrap-vue";
import { saveFile } from "../../../../../ui/src/main";
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
