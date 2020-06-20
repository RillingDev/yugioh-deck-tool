<template>
    <div>
        <BDropdownItem @click="() => copyList()">
            To Deck List in Clipboard
        </BDropdownItem>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DeckExportService } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItem } from "bootstrap-vue";
import { copyText } from "../../../../../ui/src/main";
import { appStore } from "../../../composition/appStore";
import { showSuccess } from "../../../composition/feedback";

const deckExportService = applicationContainer.get<DeckExportService>(
    APPLICATION_TYPES.DeckExportService
);

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: (props, context) => {
        const copyList = (): void => {
            const deck = appStore(context).state.deck.active;
            const deckList = deckExportService.toShareableText(deck);
            copyText(deckList, document);
            showSuccess(
                context,
                "Successfully copied deck list to clipboard!",
                "deck-tool__portal"
            );
        };

        return { copyList };
    },
});
</script>
