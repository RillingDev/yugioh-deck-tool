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
import type { DeckExportService } from "../../../../core/src/main";
import { TYPES } from "../../../../core/src/main";
import { applicationContainer } from "../../inversify.config";
import { appStore } from "../../composition/state/appStore";
import { deckEmpty } from "../../composition/state/deckEmpty";

const deckExportService = applicationContainer.get<DeckExportService>(
    TYPES.DeckExportService
);

export default defineComponent({
    components: {},
    props: {},
    setup(props, context) {
        const isDeckEmpty = deckEmpty(context);

        const buyLink = computed<string>(() => {
            const deck = appStore(context).state.deck.active;
            return deckExportService
                .toBuyLink(deck, "deck-builder", "YGOPRODeck")
                .toString();
        });

        return { isDeckEmpty, buyLink };
    },
});
</script>
