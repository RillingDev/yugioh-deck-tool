<template>
    <div class="deck" id="deckToolDeck">
        <header class="deck__header">
            <h1 class="deck__total h4">Total</h1>
            <YgoPrice :cards="allCards" />
        </header>
        <hr />
        <YgoDeckPart
            v-for="deckPart in deckParts"
            :key="deckPart"
            :deck-part="deckPart"
            :drag-group="dragGroup"
        />
    </div>
</template>
<script lang="ts">
import { Card, DECK_PART_ARR, DeckService } from "../../../../core/src/main";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import YgoPrice from "../YgoPrice.vue";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import YgoDeckPart from "./YgoDeckPart.vue";
import { appStore } from "../../composition/state/appStore";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

export default defineComponent({
    components: {
        YgoDeckPart,
        YgoPrice,
    },
    props: {
        dragGroup: {
            required: true,
            type: String as PropType<string>,
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
@import "../../../../ui/src/styles/mixins";

.deck-tool,
.deck-tool__portal {
    .deck {
        &__header {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            @include screen-min-width(lg) {
                align-items: center;
                flex-direction: row;
            }
        }

        &__total.h4 {
            margin-bottom: $margin-sm;
            @include screen-min-width(lg) {
                margin-bottom: 0;
            }
        }
    }
}

.deck-tool__screenshot-context .deck {
    padding: $margin-sm;
}
</style>
