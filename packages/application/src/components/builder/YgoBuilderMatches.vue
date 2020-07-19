<template>
    <div class="builder_matches">
        <ol class="builder-matches__list" v-show="matches.length > 0">
            <li
                class="builder-matches__match"
                v-for="card in limitedMatches"
                :key="card.passcode"
            >
                <Draggable
                    :group="{ name: dragGroup, pull: 'clone', put: false }"
                    :list="[card]"
                    :move="canMove"
                >
                    <YgoCard
                        :card="card"
                        :scale-vertically="true"
                        class="builder-matches__match__card"
                    ></YgoCard>
                </Draggable>
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
import { Card, CardTypeGroup } from "../../../../core/src/main";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import YgoCard from "../YgoCard.vue";
import Draggable from "vuedraggable";

export default defineComponent({
    props: {
        matches: {
            required: true,
            type: Array as PropType<Card[]>,
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
    components: {
        YgoCard,
        Draggable,
    },
    setup(props) {
        const CARD_DISPLAY_LIMIT = 50;

        const limitedMatches = computed<Card[]>(() =>
            props.matches.slice(0, CARD_DISPLAY_LIMIT)
        );

        const typeText = (card: Card): string =>
            card.type.group === CardTypeGroup.MONSTER
                ? card.type.name
                : card.type.group;
        const subTypeText = (card: Card): string =>
            card.type.group === CardTypeGroup.MONSTER
                ? `${card.attribute!}/${card.subType}`
                : card.subType;

        return { limitedMatches, typeText, subTypeText };
    },
});
</script>

<style lang="scss">
@import "../../../../ui/src/styles/variables";
@import "../../../../ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__portal {
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
