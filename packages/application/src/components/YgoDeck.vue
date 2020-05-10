<template>
    <div class="deck">
        <header class="deck__header">
            <h1 class="deck__total h3">Total</h1>
            <YgoPrice :cards="allCards" />
        </header>
        <hr />
        <YgoDeckPart
            :deck-part="deckPart"
            :key="deckPart.id"
            @card-right-click="(e) => onCardRightClicked(e, deckPart)"
            v-for="deckPart in deckParts"
        />
    </div>
</template>
<script lang="ts">
import {
    Card,
    DeckPart,
    DeckService,
    DEFAULT_DECK_PART_ARR,
} from "yugioh-deck-tool-core/src/main";
import { computed, defineComponent } from "@vue/composition-api";
import YgoPrice from "./YgoPrice.vue";
import { applicationContainer } from "../inversify.config";
import { APPLICATION_TYPES } from "../types";
import YgoDeckPart from "./YgoDeckPart.vue";
import { DECK_CARD_REMOVE } from "../store/modules/deck";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

export default defineComponent({
    components: {
        YgoDeckPart,
        YgoPrice,
    },
    props: {},
    setup(props, context) {
        const deckParts = DEFAULT_DECK_PART_ARR;
        const allCards = computed<Card[]>(() =>
            deckService.getAllCards(context.root.$store.state.deck.active)
        );
        const onCardRightClicked = (e: { card: Card }, deckPart: DeckPart) => {
            context.root.$store.commit(DECK_CARD_REMOVE, {
                card: e.card,
                deckPart: deckPart,
            });
        };
        return { deckParts, allCards, onCardRightClicked };
    },
});
</script>

<style lang="scss" scoped>
@import "~yugioh-deck-tool-ui/src/styles/variables";
@import "~yugioh-deck-tool-ui/src/styles/mixin/screen";

.deck {
    margin-bottom: 1.5rem;

    &__header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        @include screen(min, lg) {
            align-items: center;
            flex-direction: row;
        }
    }

    &__total.h3 {
        margin-bottom: 0.25rem;
    }
}
</style>
