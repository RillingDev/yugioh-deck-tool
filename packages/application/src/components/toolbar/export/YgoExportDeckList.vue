<template>
    <BDropdownItemButton @click="() => copyList()">
        <span class="fas fa-paragraph fas-in-button" aria-hidden="true"></span>
        To Deck List in Clipboard
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import type { DeckExportService } from "@yugioh-deck-tool/core";
import { TYPES } from "@yugioh-deck-tool/core";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownItemButton } from "bootstrap-vue";
import { copyText } from "@yugioh-deck-tool/browser-common";
import { useAppStore } from "../../../composition/state/useAppStore";
import { showSuccess } from "../../../composition/feedback";

const deckExportService = applicationContainer.get<DeckExportService>(
    TYPES.DeckExportService
);

export default defineComponent({
    props: {},
    emits: [],
    components: { BDropdownItemButton },
    setup(props, context) {
        const copyList = (): void => {
            const deck = useAppStore(context).state.deck.active;
            const deckList = deckExportService.toShareableText(deck);
            copyText(deckList, document);
            showSuccess(
                context,
                "Successfully copied deck list to clipboard.",
                "deck-tool__portal"
            );
        };

        return { copyList };
    },
});
</script>
