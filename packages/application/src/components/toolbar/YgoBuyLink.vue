<template>
    <a
        :disabled="isDeckEmpty"
        :class="{ disabled: isDeckEmpty }"
        :href="buyLink"
        class="btn btn-primary"
        target="_blank"
        rel="noopener noreferrer"
    >
        <span
            class="fas fas-in-button fa-shopping-cart"
            aria-hidden="true"
        ></span>
        Buy Deck
    </a>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import type { DeckExportService } from "@yugioh-deck-tool/core";
import { TYPES } from "@yugioh-deck-tool/core";
import { applicationContainer } from "../../inversify.config";
import { useAppStore } from "../../composition/state/useAppStore";
import { useDeckEmpty } from "../../composition/state/useDeckEmpty";

const deckExportService = applicationContainer.get<DeckExportService>(
    TYPES.DeckExportService
);

export default defineComponent({
    props: {},
    emits: [],
    components: {},
    setup(props, context) {
        const isDeckEmpty = useDeckEmpty(context);

        const buyLink = computed<string>(() => {
            const deck = useAppStore(context).state.deck.active;
            return deckExportService
                .toBuyLink(deck, "deck-builder", "YGOPRODeck")
                .toString();
        });

        return { isDeckEmpty, buyLink };
    },
});
</script>
