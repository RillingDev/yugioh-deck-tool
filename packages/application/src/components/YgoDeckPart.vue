<template>
    <section :class="`deck-part--${deckPart.id}`" class="deck-part">
        <header class="deck-part__header">
            <div class="deck-part__details">
                <h1 class="deck-part__name h4">{{ deckPart.name }} Deck</h1>
                <span class="deck-part__stats">({{ cards.length }} Cards)</span>
            </div>
            <YgoPrice :cards="cards" />
        </header>
        <main class="deck-part__content" v-if="cards.length > 0">
            <YgoCard
                :card="card"
                :key="cardIndex"
                v-for="(card, cardIndex) in cards"
                @right-click="(e) => onCardRightClick(e, card)"
            >
            </YgoCard>
        </main>
    </section>
</template>

<script lang="ts">
import { Card, DeckPart } from "yugioh-deck-tool-core/src/main";
import { PropType } from "vue";
import { computed, defineComponent } from "@vue/composition-api";
import YgoPrice from "./YgoPrice.vue";
import YgoCard from "./YgoCard.vue";

export default defineComponent({
    components: {
        YgoPrice,
        YgoCard,
    },
    props: {
        deckPart: {
            required: true,
            type: Object as PropType<DeckPart>,
        },
    },
    setup(props, context) {
        const cards = computed<Card[]>(() =>
            context.root.$store.state.deck.active.parts.get(props.deckPart)
        );
        const onCardRightClick = (e: unknown, card: Card) => {
            context.emit("card-right-click", { card });
        };

        return { cards, onCardRightClick };
    },
});
</script>

<style lang="scss" scoped>
@import "~yugioh-deck-tool-ui/src/styles/variables";

.deck-part {
    margin-bottom: 1.5rem;

    &--main {
        .deck-part__content {
            background-color: $color-deck-part-main;
            border-color: darken($color-deck-part-main, 10%);
        }
    }

    &--extra {
        .deck-part__content {
            background-color: $color-deck-part-extra;
            border-color: darken($color-deck-part-extra, 10%);
        }
    }

    &--side {
        .deck-part__content {
            background-color: $color-deck-part-side;
            border-color: darken($color-deck-part-side, 10%);
        }
    }

    &__header {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
    }

    &__details {
        display: flex;
        align-items: center;
    }

    &__name.h4 {
        margin: 0;
    }

    &__stats {
        margin-left: 0.75rem;
    }

    &__content {
        padding: 0.25rem;
        border: 1px solid $black;
    }
}
</style>
