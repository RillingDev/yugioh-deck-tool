<template>
    <section :class="`deck-part--${deckPart.id}`" class="deck-part">
        <header class="deck-part__header">
            <div class="deck-part__details">
                <h1 class="deck-part__name h5">{{ deckPart.name }} Deck</h1>
                <span class="deck-part__stats small">{{ deckPartStats }}</span>
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
import {
    Card,
    CardDatabase,
    CardTypeGroup,
    DeckPart,
    DefaultDeckPart,
    FilterService,
} from "yugioh-deck-tool-core/src/main";
import { PropType } from "vue";
import { computed, defineComponent } from "@vue/composition-api";
import YgoPrice from "./YgoPrice.vue";
import YgoCard from "./YgoCard.vue";
import { applicationContainer } from "../inversify.config";
import { APPLICATION_TYPES } from "../types";

const filterService = applicationContainer.get<FilterService>(
    APPLICATION_TYPES.FilterService
);
const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);

/**
 * Calculates count of card types.
 * For main and side deck, count will be split by monster, spell, etc., whereas it will be split by monster subtype for the extra deck.
 *
 * @private
 * @param deckPart Deck-part that is being used.
 * @param cards Cards to analyse.
 * @return Array of type and count pairs.
 */
const calculateDetailedTypeStats = (
    deckPart: DeckPart,
    cards: ReadonlyArray<Card>
): [string, number][] => {
    if (deckPart === DefaultDeckPart.EXTRA) {
        return cardDatabase
            .getTypes(CardTypeGroup.MONSTER)
            .filter((cardType) => cardType.deckParts.has(deckPart))
            .map((cardType) => [
                cardType.name,
                filterService.filter(cards, {
                    type: cardType,
                }).length,
            ]);
    }

    return Object.values(CardTypeGroup).map((cardTypeGroup) => [
        String(cardTypeGroup),
        filterService.filter(cards, {
            typeGroup: cardTypeGroup,
        }).length,
    ]);
};

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
        const deckPartStats = computed<string>(
            () =>
                `${cards.value.length} Cards (${calculateDetailedTypeStats(
                    props.deckPart,
                    cards.value
                )
                    .filter(([, count]) => count > 0)
                    .map(([type, count]) => `${count} ${type}`)
                    .join(" | ")})`
        );
        const onCardRightClick = (e: unknown, card: Card) => {
            context.emit("card-right-click", { card });
        };

        return { cards, deckPartStats, onCardRightClick };
    },
});
</script>

<style lang="scss" scoped>
@import "~yugioh-deck-tool-ui/src/styles/variables";
@import "~yugioh-deck-tool-ui/src/styles/mixin/screen";

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
        flex-direction: column;
        margin-bottom: 0.5rem;

        @include screen(min, lg) {
            flex-direction: row;
            align-items: center;
        }
    }

    &__details {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.25rem;
        @include screen(min, sm) {
            flex-direction: row;
            align-items: center;
        }
    }

    &__name.h5 {
        margin-bottom: 0;
    }

    &__stats {
        margin-top: 0.25rem;
        @include screen(min, sm) {
            margin-left: 1rem;
            margin-top: 0;
        }
    }

    &__content {
        padding: 0.35rem;
        border: 1px solid $black;
        display: grid;
        gap: 0.35rem;
        grid-template-columns: repeat(auto-fill, minmax(7ch, 1fr));
        @include screen(min, md) {
            grid-template-columns: repeat(auto-fill, minmax(8.5ch, 1fr));
        }
        @include screen(min, lg) {
            grid-template-columns: repeat(auto-fill, minmax(10ch, 1fr));
        }
    }
}
</style>
