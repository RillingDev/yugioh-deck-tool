<template>
    <div class="deck">
        <header class="deck__header">
            <h1 class="deck__total h3">Total</h1>
            <YgoPrice :cards="allCards" />
        </header>
        <hr />
        <YgoDeckPart
            ref="deckPartRefs"
            :deck-part="deckPart"
            :key="deckPart.id"
            :can-move="(e) => canMove(e, deckPart)"
            @change="(e) => onChange(e, deckPart)"
            v-for="deckPart in deckParts"
        />
    </div>
</template>
<script lang="ts">
import {
    Card,
    DeckService,
    DEFAULT_DECK_PART_ARR,
} from "yugioh-deck-tool-core/src/main";
import { computed, defineComponent, ref } from "@vue/composition-api";
import YgoPrice from "../YgoPrice.vue";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import YgoDeckPart from "./YgoDeckPart.vue";
import {
    DECK_CARD_ADD,
    DECK_CARD_REMOVE,
    DECK_CARD_REORDER,
} from "../../store/modules/deck";
import { Vue } from "vue/types/vue";

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

        const deckPartRefs = ref<Vue[]>(null);

        const findDeckPartForComponent = (component: Vue) =>
            DEFAULT_DECK_PART_ARR[
                deckPartRefs.value.findIndex((deckPartRef) =>
                    deckPartRef.$el.contains(component.$el)
                )
            ];

        const canMove = (e, oldDeckPart) => {
            const newDeckPart = findDeckPartForComponent(
                e.relatedContext.component
            );
            console.log("onMove", e, oldDeckPart, newDeckPart);
            if (newDeckPart == null) {
                return false;
            }
            const deck = context.root.$store.state.deck.active;
            const format = context.root.$store.state.format.active;
            const card = e.draggedContext.element;

            return deckService.canMove(
                deck,
                oldDeckPart,
                newDeckPart,
                format,
                card
            );
        };
        const onChange = (e, deckPart) => {
            console.log("onChange", e);
            if (e.removed != null) {
                console.log("removed", e.removed);
                context.root.$store.commit(DECK_CARD_REMOVE, {
                    deckPart: deckPart,
                    card: e.removed.element,
                    oldIndex: e.removed.oldIndex,
                });
            } else if (e.moved != null) {
                console.log("moved", e.moved);
                context.root.$store.commit(DECK_CARD_REORDER, {
                    deckPart: deckPart,
                    card: e.moved.element,
                    oldIndex: e.moved.oldIndex,
                    newIndex: e.moved.newIndex,
                });
            } else if (e.added != null) {
                console.log("added", e.added);

                context.root.$store.commit(DECK_CARD_ADD, {
                    deckPart: deckPart,
                    card: e.added.element,
                    newIndex: e.added.newIndex,
                });
            } else {
                console.warn(e);
            }
        };

        return {
            deckParts,
            allCards,
            canMove,
            onChange,
            deckPartRefs,
        };
    },
});
</script>

<style lang="scss">
@import "../../../../../node_modules/yugioh-deck-tool-ui/src/styles/variables";
@import "../../../../../node_modules/yugioh-deck-tool-ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__modal {
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
