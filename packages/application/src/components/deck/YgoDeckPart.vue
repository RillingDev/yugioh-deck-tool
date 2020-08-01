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
        <Draggable
            class="deck-part__content"
            tag="div"
            :group="{ name: dragGroup, pull: true, put: true }"
            v-model="cards"
            :move="(e) => canMove(e)"
            @start="() => dragStart()"
            @end="() => dragStop()"
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
    CardService,
    CardTypeCategory,
    DeckPart,
    DeckPartConfig,
    DefaultDeckPartConfig,
} from "../../../../core/src/main";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import YgoPrice from "../YgoPrice.vue";
import YgoCard from "../YgoCard.vue";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import Draggable from "vuedraggable";
import { DECK_PART_CARDS_REPLACE } from "../../store/modules/deck";
import { appStore } from "../../composition/state/appStore";
import { removeEnd } from "lightdash";
import {
    INTERACTION_DRAGGING_START,
    INTERACTION_DRAGGING_STOP,
} from "../../store/modules/interaction";
import { DECK_PART_PROP } from "../../composition/controller/dragging";

const cardService = applicationContainer.get<CardService>(
    APPLICATION_TYPES.CardService
);
const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);

/**
 * Calculates count of card types.
 * For main and side deck, count will be split by monster, spell, etc.,
 * whereas it will be split by monster subtype for the extra deck.
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
    if (deckPart === DeckPart.EXTRA) {
        const countedByType = cardService.countByType(cards);
        return cardDatabase
            .getTypes(CardTypeCategory.MONSTER)
            .filter(
                (cardType) =>
                    countedByType.has(cardType) &&
                    countedByType.get(cardType)! > 0
            )
            .map((cardType) => [
                removeEnd(cardType.name, " Monster"),
                countedByType.get(cardType)!,
            ]);
    }

    const countedByTypeCategory = cardService.countByTypeCategory(cards);
    return Object.values(CardTypeCategory)
        .filter(
            (typeCategory) =>
                countedByTypeCategory.has(typeCategory) &&
                countedByTypeCategory.get(typeCategory)! > 0
        )
        .map((typeCategory) => [
            typeCategory,
            countedByTypeCategory.get(typeCategory)!,
        ]);
};

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
        canMove: {
            required: true,
            type: Function as PropType<(e: object) => boolean>,
        },
        dragGroup: {
            required: true,
            type: String as PropType<string>,
        },
    },
    setup: (props, context) => {
        const deckPartConfig = computed<DeckPartConfig>(
            () => DefaultDeckPartConfig[props.deckPart]
        );

        const cards = computed<Card[]>({
            get: () =>
                appStore(context).state.deck.active.parts[props.deckPart],

            set: (newCards) =>
                appStore(context).commit(DECK_PART_CARDS_REPLACE, {
                    deckPart: props.deckPart,
                    cards: newCards,
                }),
        });
        const deckPartEmpty = computed<boolean>(() => cards.value.length === 0);
        const deckPartStats = computed<string>(() => {
            const currentCards = cards.value;
            const base = `${currentCards.length} Cards`;
            if (currentCards.length === 0) {
                return base;
            }
            const details = calculateDetailedTypeStats(
                props.deckPart,
                currentCards
            ).map(([type, count]) => `${count} ${type}`);
            return `${base} (${details.join(" | ")})`;
        });

        const dragStart = (): void =>
            appStore(context).commit(INTERACTION_DRAGGING_START);
        const dragStop = (): void =>
            appStore(context).commit(INTERACTION_DRAGGING_STOP);

        return {
            deckPartConfig,
            cards,
            deckPartStats,
            deckPartEmpty,
            dragStart,
            dragStop,
        };
    },
});
</script>

<style lang="scss">
@import "../../../../ui/src/styles/variables";
@import "../../../../ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__portal {
    .deck-part {
        margin-bottom: $margin-lg;

        &--main {
            .deck-part__content {
                border-color: darken($color-deck-part-main, 8%);
                background-color: $color-deck-part-main;
            }
        }

        &--extra {
            .deck-part__content {
                border-color: darken($color-deck-part-extra, 8%);
                background-color: $color-deck-part-extra;
            }
        }

        &--side {
            .deck-part__content {
                border-color: darken($color-deck-part-side, 8%);
                background-color: $color-deck-part-side;
            }
        }

        &__header {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: $margin-md;

            @include screen(min, lg) {
                align-items: center;
                flex-direction: row;
            }
        }

        &__details {
            display: flex;
            flex-direction: column;
            margin-bottom: $margin-sm;
            @include screen(min, lg) {
                margin-bottom: 0;
            }
        }

        &__name.h5 {
            margin-bottom: $margin-sm;
            @include screen(min, md) {
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
            @include screen(min, md) {
                grid-template-columns: repeat(auto-fill, minmax(8.5ch, 1fr));
            }
            @include screen(min, lg) {
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
