<template>
    <a
        :disabled="deckEmpty"
        :class="{ disabled: deckEmpty }"
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
import { useStore } from "../../store/store";

const deckExportService = applicationContainer.get<DeckExportService>(
    TYPES.DeckExportService
);

export default defineComponent({
    components: {},
    props: {},
    emits: [],
    setup(props, context) {
        const store = useStore();

        const deckEmpty = computed<boolean>(() => store.getters.isDeckEmpty);

        const buyLink = computed<string>(() => {
            const deck = store.state.deck.active;
            return deckExportService
                .toBuyLink(deck, "deck-builder", "YGOPRODeck")
                .toString();
        });

        return { deckEmpty, buyLink };
    },
});
</script>
