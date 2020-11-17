<template>
    <div class="builder_matches">
        <ol class="builder-matches__list" v-show="matches.length > 0">
            <li
                class="builder-matches__match"
                v-for="card in limitedMatches"
                :key="card.passcode"
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
                        <small>{{ typeText(card) }}</small>
                    </p>
                    <p>
                        <small>{{ subTypeText(card) }}</small>
                    </p>
                </div>
            </li>
        </ol>
        <div class="builder-matches__no-matches" v-show="matches.length === 0">
            No matches found.
        </div>
    </div>
</template>

<script lang="ts">
import type { Card, DeckService } from "../../../../core/src/main";
import { CardTypeCategory } from "../../../../core/src/main";
import type { PropType } from "@vue/composition-api";
import { computed, defineComponent } from "@vue/composition-api";
import YgoCard from "../YgoCard.vue";
import Draggable from "vuedraggable";
import { createMoveFromBuilderValidator } from "../../composition/dragging";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import { appStore } from "../../composition/state/appStore";
import { DECK_PART_CARDS_ADD } from "../../store/modules/deck";
import { browserSupportsTouch } from "../../../../ui/src/main";
import { showSuccess } from "../../composition/feedback";
import { enableTooltip, disableTooltip } from "../../../../tooltip/src/main";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);
export default defineComponent({
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
    components: {
        YgoCard,
        Draggable,
    },
    setup(props, context) {
        const CARD_DISPLAY_LIMIT = 50;
        const store = appStore(context);

        const limitedMatches = computed<Card[]>(() =>
            props.matches.slice(0, CARD_DISPLAY_LIMIT)
        );

        const typeText = (card: Card): string =>
            card.type.category === CardTypeCategory.MONSTER
                ? card.type.name
                : card.type.category;
        const subTypeText = (card: Card): string =>
            card.type.category === CardTypeCategory.MONSTER
                ? `${card.attribute!}/${card.subType}`
                : card.subType;

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

        const canMove = createMoveFromBuilderValidator(context);

        return {
            limitedMatches,
            typeText,
            subTypeText,
            canMove,
            addCard,
            isTouchDevice,
            enableTooltip,
            disableTooltip,
        };
    },
});
</script>

<style lang="scss">
@import "../../../../ui/src/styles/variables";
@import "../../../../ui/src/styles/mixins";

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
