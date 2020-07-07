<template>
    <a
        :disabled="isDeckEmpty"
        :class="{ disabled: isDeckEmpty }"
        :href="buyLink"
        class="btn btn-primary"
        target="_blank"
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
import { DeckExportService } from "../../../../core/src/main";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import { appStore } from "../../composition/appStore";
import { deckEmpty } from "../../composition/deckEmpty";

const deckExportService = applicationContainer.get<DeckExportService>(
    APPLICATION_TYPES.DeckExportService
);

export default defineComponent({
    components: {},
    props: {},
    setup: (props, context) => {
        const isDeckEmpty = deckEmpty(context);

        const buyLink = computed<string>(() =>
            deckExportService
                .toBuyLink(appStore(context).state.deck.active)
                .toString()
        );

        return { isDeckEmpty, buyLink };
    },
});
</script>
