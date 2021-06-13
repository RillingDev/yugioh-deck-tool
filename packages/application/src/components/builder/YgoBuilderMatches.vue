<template>
    <div class="builder_matches">
        <ol
            v-show="matches.length > 0"
            class="builder-matches__list"
            @scroll.passive="(e) => scrollHandler(e)"
        >
            <li
                v-for="card in limitedMatches"
                :key="card.passcode"
                class="builder-matches__match"
            >
                <template v-if="isTouchDevice">
                    <YgoCard
                        :card="card"
                        :scale-vertically="true"
                        class="builder-matches__match__card"
                        @click.native.prevent="() => addCard(card)"
                    ></YgoCard>
                </template>
                <template v-else>
                    <Draggable
                        :group="{
                            name: dragGroup,
                            pull: 'clone',
                            put: false,
                        }"
                        :value="[card]"
                        :move="(e) => canMove(e)"
                        :animation="0"
                        @start="() => disableTooltip()"
                        @end="() => enableTooltip()"
                    >
                        <YgoCard
                            :card="card"
                            :scale-vertically="true"
                            class="builder-matches__match__card"
                        ></YgoCard>
                    </Draggable>
                </template>

                <div class="builder-matches__match__details">
                    <p>{{ card.name }}</p>
                    <p>
                        <small>{{ getTypeText(card) }}</small>
                    </p>
                    <p>
                        <small>{{ getSubTypeText(card) }}</small>
                    </p>
                    <p>
                        <small v-show="getCardCount(card) != null"
                            >{{ getCardCount(card) }} in Collection</small
                        >
                    </p>
                </div>
            </li>
        </ol>
        <div v-show="matches.length === 0" class="builder-matches__no-matches">
            No matches found.
        </div>
    </div>
</template>

<script lang="ts">
import type {
    Card,
    CardCountFunction,
    DeckService,
} from "@yugioh-deck-tool/core";
import { CardTypeCategory, TYPES } from "@yugioh-deck-tool/core";
import type { PropType } from "@vue/composition-api";
import { computed, defineComponent } from "@vue/composition-api";
import YgoCard from "../YgoCard.vue";
import Draggable from "vuedraggable";
import type { DraggableMoveValidatorData } from "../../composition/dragging";
import {
    findCardForDraggableValidatorData,
    findDeckPartForDraggableValidatorData,
} from "../../composition/dragging";
import { applicationContainer } from "../../inversify.config";
import { DECK_PART_CARDS_ADD } from "../../store/modules/deck";
import { browserSupportsTouch } from "@yugioh-deck-tool/browser-common";
import { showSuccess } from "../../composition/feedback";
import { useInfiniteScrolling } from "../../composition/infiniteScrolling";
import { disableTooltip, enableTooltip } from "../../../../tooltip/src/main";
import { useStore } from "../../store/store";

const deckService = applicationContainer.get<DeckService>(TYPES.DeckService);

export default defineComponent({
    components: {
        YgoCard,
        Draggable,
    },
    props: {
        matches: {
            required: true,
            type: Array as PropType<Card[]>,
        },
        dragGroup: {
            required: true,
            type: String as PropType<string>,
        },
    },
    emits: [],
    setup(props, context) {
        const store = useStore();

        const { limitedArr: limitedMatches, scrollHandler } =
            useInfiniteScrolling(
                computed(() => props.matches),
                50,
                25
            );

        const cardCountFunction = computed<CardCountFunction | null>(
            () => store.state.collection.cardCountFunction
        );

        const getTypeText = (card: Card): string =>
            card.type.category === CardTypeCategory.MONSTER
                ? card.type.name
                : card.type.category;
        const getSubTypeText = (card: Card): string =>
            card.type.category === CardTypeCategory.MONSTER
                ? `${card.attribute!}/${card.subType}`
                : card.subType;
        const getCardCount = (card: Card): number | null =>
            cardCountFunction.value?.(card) ?? null;

        const isTouchDevice = computed<boolean>(browserSupportsTouch);

        const addCard = (card: Card): void => {
            const deckPart = deckService.findAvailableDeckPart(
                store.state.deck.active,
                card,
                store.state.format.active
            );
            if (deckPart != null) {
                store.commit(DECK_PART_CARDS_ADD, { card, deckPart });
                showSuccess(
                    context,
                    "Successfully added card to deck.",
                    "deck-tool__portal"
                );
            }
        };

        const canMove = (e: DraggableMoveValidatorData): boolean => {
            const card = findCardForDraggableValidatorData(e);
            const newDeckPart = findDeckPartForDraggableValidatorData(e);
            if (newDeckPart == null) {
                return false;
            }
            const deck = store.state.deck.active;
            const format = store.state.format.active;

            return deckService.canAdd(deck, card, newDeckPart, format);
        };

        return {
            limitedMatches,
            getTypeText,
            getSubTypeText,
            getCardCount,
            canMove,
            addCard,
            isTouchDevice,
            enableTooltip,
            disableTooltip,
            scrollHandler,
        };
    },
});
</script>

<style lang="scss">
@import "~@yugioh-deck-tool/browser-common/src/styles/variables";
@import "~@yugioh-deck-tool/browser-common/src/styles/mixins";

.deck-tool {
    .builder-matches {
        &__no-matches {
            margin-top: $margin-md;
            margin-bottom: $margin-md;
            text-align: center;
            color: $gray-600;
        }

        &__list {
            overflow-y: scroll;
            max-height: 50rem;
            margin: 0;
            padding: 0;
            list-style: none;
            border: 1px solid $gray-400;
        }

        &__match {
            display: flex;
            padding: 0.35rem;
            border-bottom: 1px solid $gray-400;

            &__card {
                height: 5rem;
            }

            &__details {
                padding-left: $margin-md;

                > p {
                    margin-bottom: 0;
                }
            }
        }
    }
}
</style>
