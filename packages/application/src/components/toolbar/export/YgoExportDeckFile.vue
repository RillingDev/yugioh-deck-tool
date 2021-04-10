<template>
    <BDropdownItemButton @click="() => downloadDeck()">
        <span class="fas fa-file fas-in-button" aria-hidden="true"></span>
        To .ydk Deck File
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DeckFileService, TYPES } from "@yugioh-deck-tool/core";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownItemButton } from "bootstrap-vue";
import { downloadFile } from "@yugioh-deck-tool/browser-common";
import { useAppStore } from "../../../composition/state/useAppStore";
import { showSuccess } from "../../../composition/feedback";

const deckFileService = applicationContainer.get<DeckFileService>(
    TYPES.DeckFileService
);

export default defineComponent({
    props: {},
    emits: [],
    components: { BDropdownItemButton },
    setup(props, context) {
        const downloadDeck = (): void => {
            const deck = useAppStore(context).state.deck.active;
            const { fileContent, fileName } = deckFileService.toFile(deck);
            const file = new File([fileContent], fileName, {
                type: DeckFileService.DECK_FILE_MIME_TYPE,
            });
            downloadFile(file, document);
            showSuccess(
                context,
                "Successfully exported deck file.",
                "deck-tool__portal"
            );
        };

        return { downloadDeck };
    },
});
</script>
