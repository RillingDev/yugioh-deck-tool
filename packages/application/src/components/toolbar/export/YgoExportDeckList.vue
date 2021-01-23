<template>
    <BDropdownItemButton @click="() => copyList()">
        <span class="fas fa-paragraph fas-in-button" aria-hidden="true"></span>
        To Deck List in Clipboard
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import type { DeckExportService } from "../../../../../core/src/main";
import { TYPES } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItemButton } from "bootstrap-vue";
import { copyText } from "../../../../../browser-common/src/main";
import { appStore } from "../../../composition/state/appStore";
import { showSuccess } from "../../../composition/feedback";

const deckExportService = applicationContainer.get<DeckExportService>(
    TYPES.DeckExportService
);

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    setup(props, context) {
        const copyList = (): void => {
            const deck = appStore(context).state.deck.active;
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
