<template>
    <div class="deck">
        <header class="deck__header">
            <h1 class="deck__total h3">Total</h1>
            <YgoPrice :cards="allCards" />
        </header>
        <hr />
        <YgoDeckPart
            v-for="deckPart in deckParts"
            :key="deckPart"
            :deck-part="deckPart"
            :can-move="(e) => canMove(e, deckPart)"
        />
    </div>
</template>
<script lang="ts">
import {
    Card,
    DECK_PART_ARR,
    DeckPart,
    DeckService,
} from "../../../../core/src/main";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import YgoPrice from "../YgoPrice.vue";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import YgoDeckPart from "./YgoDeckPart.vue";
import { appStore } from "../../composition/appStore";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

export default defineComponent({
    components: {
        YgoDeckPart,
        YgoPrice,
    },
    props: {
        canMove: {
            required: true,
            type: Function as PropType<
                (e: object, deckPart: DeckPart) => boolean
            >,
        },
    },
    setup(props, context) {
        const deckParts = DECK_PART_ARR;
        const allCards = computed<Card[]>(() =>
            deckService.getAllCards(appStore(context).state.deck.active)
        );

        return {
            deckParts,
            allCards,
        };
    },
});
</script>

<style lang="scss">
@import "../../../../ui/src/styles/variables";
@import "../../../../ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__portal {
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
}
</style>
