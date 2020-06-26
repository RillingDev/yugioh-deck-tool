<template>
    <BDropdownItem @click="() => downloadDeck()">
        To .ydk Deck File
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DeckFileService } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItem } from "bootstrap-vue";
import { downloadFile } from "../../../../../ui/src/main";
import { appStore } from "../../../composition/appStore";
import { showSuccess } from "../../../composition/feedback";

const deckFileService = applicationContainer.get<DeckFileService>(
    APPLICATION_TYPES.DeckFileService
);

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: (props, context) => {
        const downloadDeck = (): void => {
            const deck = appStore(context).state.deck.active;
            const { fileContent, fileName } = deckFileService.toFile(deck);
            const file = new File([fileContent], fileName);
            downloadFile(file, document);
            showSuccess(
                context,
                "Successfully exported deck file!",
                "deck-tool__portal"
            );
        };

        return { downloadDeck };
    },
});
</script>
