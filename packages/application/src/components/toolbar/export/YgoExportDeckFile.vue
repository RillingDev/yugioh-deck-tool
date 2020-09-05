<template>
    <BDropdownItemButton @click="() => downloadDeck()">
        <span class="fas fa-file fas-in-button" aria-hidden="true"></span>
        To .ydk Deck File
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import type { DeckFileService } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItemButton } from "bootstrap-vue";
import { downloadFile } from "../../../../../ui/src/main";
import { appStore } from "../../../composition/state/appStore";
import { showSuccess } from "../../../composition/feedback";

const deckFileService = applicationContainer.get<DeckFileService>(
    APPLICATION_TYPES.DeckFileService
);

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    setup: (props, context) => {
        const downloadDeck = (): void => {
            const deck = appStore(context).state.deck.active;
            const { fileContent, fileName } = deckFileService.toFile(deck);
            const file = new File([fileContent], fileName);
            downloadFile(URL.createObjectURL(file), file.name, document);
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
