<template>
    <section :class="`deck-part--${deckPart.id}`" class="deck-part">
        <header class="deck-part__header">
            <div class="deck-part__details">
                <h1 class="deck-part__name h5">{{ deckPart.name }} Deck</h1>
                <span class="deck-part__stats small">{{ deckPartStats }}</span>
            </div>
            <YgoPrice :cards="cards" />
        </header>
        <Draggable
            v-if="cards.length > 0"
            tag="main"
            class="deck-part__content"
            :list="cards"
            group="cards"
            :move="handleMove"
            @change="onChange"
        >
            <YgoCard
                :card="card"
                :key="`${cardIndex}_${card.passcode}`"
                v-for="(card, cardIndex) in cards"
            >
            </YgoCard>
        </Draggable>
    </section>
</template>

<script lang="ts">
import {
    Card,
    CardDatabase,
    CardTypeGroup,
    DeckPart,
    DeckService,
    DefaultDeckPart,
    FilterService,
} from "yugioh-deck-tool-core/src/main";
import { PropType } from "vue";
import { computed, defineComponent } from "@vue/composition-api";
import YgoPrice from "../YgoPrice.vue";
import YgoCard from "../YgoCard.vue";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import Draggable from "vuedraggable";
import {
    DECK_CARD_ADD,
    DECK_CARD_REMOVE,
    DECK_CARD_REORDER,
} from "@/store/modules/deck";

const filterService = applicationContainer.get<FilterService>(
    APPLICATION_TYPES.FilterService
);
const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);
const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
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
        return cardDatabase.getTypes(CardTypeGroup.MONSTER).map((cardType) => [
            cardType.name.replace(" Monster", ""),
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
        Draggable,
    },
    props: {
        deckPart: {
            required: true,
            type: Object as PropType<DeckPart>,
        },
    },
    setup: function (props, context) {
        const cards = computed<Card[]>(() =>
            context.root.$store.state.deck.active.parts.get(props.deckPart)
        );
        const deckPartStats = computed<string>(() => {
            const currentCards = cards.value;
            const base = `${currentCards.length} Cards`;
            if (currentCards.length === 0) {
                return base;
            }
            const details = calculateDetailedTypeStats(
                props.deckPart,
                currentCards
            )
                .filter(([, count]) => count > 0)
                .map(([type, count]) => `${count} ${type}`);
            return `${base} (${details.join(" | ")})`;
        });
        const $store = context.root.$store;
        const handleMove = (e) => {
            console.log("handleMove", e);
            const deck = $store.state.deck.active;
            const format = $store.state.format.active;
            const card = e.draggedContext.element;

            return deckService.canMove(
                deck,
                props.deckPart,
                props.deckPart,
                format,
                card
            );
        };
        const onChange = (e) => {
            console.log("onChange", e);
            if (e.added != null) {
                console.log("onAdd");
                $store.commit(DECK_CARD_ADD, {
                    deckPart: props.deckPart,
                    card: e.added.element,
                    newIndex: e.added.newIndex,
                });
            } else if (e.removed != null) {
                console.log("onRemove");
                $store.commit(DECK_CARD_REMOVE, {
                    deckPart: props.deckPart,
                    card: e.removed.element,
                    oldIndex: e.removed.oldIndex,
                });
            } else {
                console.log("onMove");
                $store.commit(DECK_CARD_REORDER, {
                    deckPart: props.deckPart,
                    card: e.moved.element,
                    oldIndex: e.moved.oldIndex,
                    newIndex: e.moved.newIndex,
                });
            }
        };

        return { cards, deckPartStats, handleMove, onChange };
    },
});
</script>

<style lang="scss">
@import "../../../../../node_modules/yugioh-deck-tool-ui/src/styles/variables";
@import "../../../../../node_modules/yugioh-deck-tool-ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__modal {
    .deck-part {
        margin-bottom: 1.5rem;

        &--main {
            .deck-part__content {
                border-color: darken($color-deck-part-main, 10%);
                background-color: $color-deck-part-main;
            }
        }

        &--extra {
            .deck-part__content {
                border-color: darken($color-deck-part-extra, 10%);
                background-color: $color-deck-part-extra;
            }
        }

        &--side {
            .deck-part__content {
                border-color: darken($color-deck-part-side, 10%);
                background-color: $color-deck-part-side;
            }
        }

        &__header {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: 0.5rem;

            @include screen(min, lg) {
                align-items: center;
                flex-direction: row;
            }
        }

        &__details {
            display: flex;
            flex-direction: column;
            margin-bottom: 0.25rem;
            @include screen(min, sm) {
                align-items: center;
                flex-direction: row;
            }
        }

        &__name.h5 {
            margin-bottom: 0;
        }

        &__stats {
            margin-top: 0.25rem;
            @include screen(min, sm) {
                margin-top: 0;
                margin-left: 1rem;
            }
        }

        &__content {
            display: grid;
            padding: 0.35rem;
            border: 1px solid $black;
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
}
</style>
