<template>
    <section
        :class="[
            `deck-part--${deckPart}`,
            { 'deck-part--empty': deckPartEmpty },
        ]"
        class="deck-part"
    >
        <header class="deck-part__header">
            <div class="deck-part__details">
                <h2 class="deck-part__name h5">
                    {{ deckPartConfig.name }} Deck
                </h2>
                <small class="deck-part__stats">{{ deckPartStats }}</small>
            </div>
            <YgoPrice :cards="cards" />
        </header>
        <!-- Spill is set to 'revert', actual removal is done in custom draggable variant -->
        <Draggable
            class="deck-part__content"
            tag="div"
            :group="{ name: dragGroup, pull: true, put: true }"
            :value="cards"
            :move="(e) => canMove(e)"
            @change="(e) => onChange(e)"
            :revert-on-spill="true"
            :animation="0"
            @start="() => disableTooltip()"
            @end="() => enableTooltip()"
        >
            <YgoCard
                :card="card"
                :key="`${cardIndex}_${card.passcode}`"
                v-for="(card, cardIndex) in cards"
                @contextmenu.native.prevent="() => removeCard(card, cardIndex)"
            >
            </YgoCard>
        </Draggable>
    </section>
</template>

<script lang="ts">
import type { Card, DeckPart, DeckPartConfig } from "../../../../core/src/main";
import { DefaultDeckPartConfig, getLogger } from "../../../../core/src/main";
import type { PropType } from "@vue/composition-api";
import { computed, defineComponent } from "@vue/composition-api";
import YgoPrice from "../YgoPrice.vue";
import YgoCard from "../YgoCard.vue";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import Draggable from "vuedraggable";
import {
    DECK_PART_CARDS_ADD,
    DECK_PART_CARDS_REMOVE,
    DECK_PART_CARDS_REORDER,
} from "../../store/modules/deck";
import { disableTooltip, enableTooltip } from "../../../../tooltip/src/main";
import { appStore } from "../../composition/state/appStore";
import type { DraggableChangeEventData } from "../../composition/dragging";
import {
    createMoveInDeckPartValidator,
    DECK_PART_PROP,
} from "../../composition/dragging";
import type { DeckController } from "../../controller/DeckController";

const deckController = applicationContainer.get<DeckController>(
    APPLICATION_TYPES.DeckController
);

const logger = getLogger("YgoDeckPart");

export default defineComponent({
    components: {
        YgoPrice,
        YgoCard,
        Draggable,
    },
    props: {
        [DECK_PART_PROP]: {
            required: true,
            type: String as PropType<DeckPart>,
        },
        dragGroup: {
            required: true,
            type: String as PropType<string>,
        },
    },
    setup(props, context) {
        const deckPartConfig = computed<DeckPartConfig>(
            () => DefaultDeckPartConfig[props.deckPart]
        );

        const cards = computed<Card[]>(
            () => appStore(context).state.deck.active.parts[props.deckPart]
        );
        const deckPartEmpty = computed<boolean>(() => cards.value.length === 0);
        const deckPartStats = computed<string>(() => {
            const currentCards = cards.value;
            const base = `${currentCards.length} Cards`;
            if (currentCards.length === 0) {
                return base;
            }
            const details = deckController
                .calculateDetailedTypeStats(props.deckPart, currentCards)
                .map(([type, count]) => `${count} ${type}`);
            return `${base} (${details.join(" | ")})`;
        });

        const addCard = (card: Card, newIndex: number): void =>
            appStore(context).commit(DECK_PART_CARDS_ADD, {
                deckPart: props.deckPart,
                card,
                newIndex,
            });
        const removeCard = (card: Card, oldIndex: number): void =>
            appStore(context).commit(DECK_PART_CARDS_REMOVE, {
                deckPart: props.deckPart,
                card,
                oldIndex,
            });
        const reorderCard = (
            card: Card,
            oldIndex: number,
            newIndex: number
        ): void =>
            appStore(context).commit(DECK_PART_CARDS_REORDER, {
                deckPart: props.deckPart,
                card,
                oldIndex,
                newIndex,
            });
        const onChange = (e: DraggableChangeEventData): void => {
            if (e.removed != null) {
                removeCard(e.removed.element, e.removed.oldIndex);
            } else if (e.added != null) {
                addCard(e.added.element, e.added.newIndex);
            } else if (e.moved != null) {
                reorderCard(
                    e.moved.element,
                    e.moved.oldIndex,
                    e.moved.newIndex
                );
            } else {
                logger.warn("Unexpected drag event type.", e);
            }
        };
        const canMove = createMoveInDeckPartValidator(context, props.deckPart);

        return {
            deckPartConfig,
            cards,

            deckPartStats,
            deckPartEmpty,

            onChange,
            removeCard,
            canMove,

            enableTooltip,
            disableTooltip,
        };
    },
});
</script>

<style lang="scss">
@use "sass:color";
@import "../../../../browser-common/src/styles/variables";
@import "../../../../browser-common/src/styles/mixins";

.deck-tool {
    .deck-part {
        margin-bottom: $margin-lg;

        &--main {
            .deck-part__content {
                border-color: color.adjust(
                    $color-deck-part-main,
                    $lightness: -8%
                );
                background-color: $color-deck-part-main;
            }
        }

        &--extra {
            .deck-part__content {
                border-color: color.adjust(
                    $color-deck-part-extra,
                    $lightness: -8%
                );
                background-color: $color-deck-part-extra;
            }
        }

        &--side {
            .deck-part__content {
                border-color: color.adjust(
                    $color-deck-part-side,
                    $lightness: -8%
                );
                background-color: $color-deck-part-side;
            }
        }

        &__header {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: $margin-md;

            @include screen-min-width(lg) {
                align-items: center;
                flex-direction: row;
            }
        }

        &__details {
            display: flex;
            flex-direction: column;
            margin-bottom: $margin-sm;
            @include screen-min-width(lg) {
                margin-bottom: 0;
            }
        }

        &__name.h5 {
            margin-bottom: $margin-sm;
            @include screen-min-width(md) {
                margin-bottom: 0;
            }
        }

        &__content {
            min-height: 6rem; // Add a little space for cards to be dragged to
            display: grid;
            padding: $margin-sm;
            border: 3px solid $black;
            gap: $margin-sm;
            grid-template-columns: repeat(auto-fill, minmax(7ch, 1fr));
            @include screen-min-width(md) {
                grid-template-columns: repeat(auto-fill, minmax(8.5ch, 1fr));
            }
            @include screen-min-width(lg) {
                grid-template-columns: repeat(auto-fill, minmax(10ch, 1fr));
            }
        }
    }
}

.deck-tool__screenshot-context {
    .deck-part {
        &--empty {
            display: none;
        }
    }
}
</style>
