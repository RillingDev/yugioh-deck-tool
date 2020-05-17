<template>
    <div class="builder-matches">
        <ol class="builder-matches__list" v-if="cards.length > 0">
            <li
                :key="card.passcode"
                class="builder-matches__match"
                v-for="card in cards"
            >
                <YgoCard
                    :card="card"
                    :scale-vertically="true"
                    class="builder-matches__match__card"
                ></YgoCard>
                <div class="builder-matches__match__details">
                    <p>{{ card.name }}</p>
                    <p>
                        <small>{{ createTypeText(card) }}</small>
                    </p>
                    <p>
                        <small>{{ createSubTypeText(card) }}</small>
                    </p>
                </div>
            </li>
        </ol>
        <div class="builder-matches__no-matches" v-if="cards.length === 0">
            No matches found.
        </div>
    </div>
</template>

<script lang="ts">
import { Card, CardTypeGroup } from "yugioh-deck-tool-core/src/main";
import { defineComponent } from "@vue/composition-api";
import YgoCard from "@/components/YgoCard.vue";
import { PropType } from "vue";

export default defineComponent({
    props: {
        cards: {
            required: true,
            type: Array as PropType<Card[]>,
        },
    },
    components: {
        YgoCard,
    },
    setup() {
        const createTypeText = (card: Card) =>
            card.type.group === CardTypeGroup.MONSTER
                ? card.type.name
                : card.type.group;
        const createSubTypeText = (card: Card) =>
            card.type.group === CardTypeGroup.MONSTER
                ? `${card.attribute}/${card.subType}`
                : card.subType;

        return { createTypeText, createSubTypeText };
    },
});
</script>

<style lang="scss">
@import "../../../../../node_modules/yugioh-deck-tool-ui/src/styles/variables";
@import "../../../../../node_modules/yugioh-deck-tool-ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__modal {
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

            &__card {
                height: 5rem;
            }

            &__details {
                padding-left: 0.5rem;
                > p {
                    margin-bottom: 0;
                }
            }

            &:not(:last-child) {
                border-bottom: 1px solid $gray-400;
            }
        }
    }
}
</style>
