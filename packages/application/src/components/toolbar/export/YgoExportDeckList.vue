<template>
    <BDropdownItemButton @click="() => copyList()">
        <span class="fas fa-paragraph fas-in-button" aria-hidden="true"></span>
        To Deck List in Clipboard
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import type { DeckExportService } from "@yugioh-deck-tool/core";
import { getLogger, TYPES } from "@yugioh-deck-tool/core";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownItemButton } from "bootstrap-vue";
import { useAppStore } from "../../../composition/state/useAppStore";
import { showError, showSuccess } from "../../../composition/feedback";

const deckExportService = applicationContainer.get<DeckExportService>(
    TYPES.DeckExportService
);

const logger = getLogger("YgoExportDeckList");

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    emits: [],
    setup(props, context) {
        const copyList = (): void => {
            const deck = useAppStore(context).state.deck.active;
            const deckList = deckExportService.toShareableText(deck);

            navigator.clipboard
                .writeText(deckList)
                .then(() =>
                    showSuccess(
                        context,
                        "Successfully copied deck list to clipboard.",
                        "deck-tool__portal"
                    )
                )
                .catch((err) => {
                    logger.error("Could not copy deck list!", err);
                    showError(
                        context,
                        "Could not copy deck list.",
                        "deck-tool__portal"
                    );
                });
        };

        return { copyList };
    },
});
</script>
