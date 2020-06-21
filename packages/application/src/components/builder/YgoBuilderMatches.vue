<template>
    <div class="builder_matches">
        <Draggable
            tag="ol"
            class="builder-matches__list"
            :group="{ name: 'cards', pull: 'clone', put: false }"
            :list="matches"
            :sort="false"
            :move="canMove"
            v-show="matches.length > 0"
        >
            <li
                class="builder-matches__match"
                v-for="card in matches"
                :key="card.passcode"
            >
                <YgoCard
                    :card="card"
                    :scale-vertically="true"
                    class="builder-matches__match__card"
                ></YgoCard>
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
        </Draggable>
        <div class="builder-matches__no-matches" v-show="matches.length === 0">
            No matches found.
        </div>
    </div>
</template>

<script lang="ts">
import { Card, CardTypeGroup } from "../../../../core/src/main";
import { defineComponent, PropType } from "@vue/composition-api";
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
    },
    components: {
        YgoCard,
        Draggable,
    },
    setup(props) {
        const typeText = (card: Card) =>
            card.type.group === CardTypeGroup.MONSTER
                ? card.type.name
                : card.type.group;
        const subTypeText = (card: Card) =>
            card.type.group === CardTypeGroup.MONSTER
                ? `${card.attribute!}/${card.subType}`
                : card.subType;

        return { typeText, subTypeText };
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
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
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
                padding-left: 0.5rem;

                > p {
                    margin-bottom: 0;
                }
            }

            &.sortable-drag,
            &.sortable-chosen {
                border-bottom: 0;
                .builder-matches__match__details {
                    display: none;
                }
            }
        }
    }
}
</style>
