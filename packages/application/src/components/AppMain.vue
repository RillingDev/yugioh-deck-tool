<template>
    <div class="row">
        <div class="col-md-6 col-lg-8">
            <YgoDeck :can-move="canMoveInDeckParts" />
        </div>
        <div class="col-md-6 col-lg-4">
            <YgoBuilder :can-move="canMoveFromBuilder" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import YgoBuilder from "./builder/YgoBuilder.vue";
import YgoDeck from "./deck/YgoDeck.vue";
import { applicationContainer } from "../inversify.config";
import { APPLICATION_TYPES } from "../types";
import { DeckPart, DeckService } from "../../../core/src/main";
import { Vue } from "vue/types/vue";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

// Workaround-ish solution to allow fetching the target deckpart of a a drag event.
const findDeckPartForComponent = (el: Vue): DeckPart | null => {
    let current = el;
    while (current.$parent != null) {
        const deckPart = current.$props["deckPart"] as DeckPart;
        if (deckPart != null) {
            return deckPart;
        }
        current = current.$parent;
    }
    return null;
};

export default defineComponent({
    components: {
        YgoDeck,
        YgoBuilder,
    },
    props: {},
    setup: function (props, context) {
        const canMoveInDeckParts = (e: any, oldDeckPart: DeckPart): boolean => {
            const newDeckPart = findDeckPartForComponent(
                e.relatedContext.component
            );
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

        const canMoveFromBuilder = (e: any): boolean => {
            const newDeckPart = findDeckPartForComponent(
                e.relatedContext.component
            );
            if (newDeckPart == null) {
                return false;
            }
            const deck = context.root.$store.state.deck.active;
            const format = context.root.$store.state.format.active;
            const card = e.draggedContext.element;

            return deckService.canAdd(deck, newDeckPart, format, card);
        };

        return { canMoveInDeckParts, canMoveFromBuilder };
    },
});
</script>
