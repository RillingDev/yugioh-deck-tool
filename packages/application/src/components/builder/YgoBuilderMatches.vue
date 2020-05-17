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
                    <p>{{ card.type.group }}</p>
                </div>
            </li>
        </ol>
        <div class="builder-matches__no-matches" v-if="cards.length === 0">
            No matches found.
        </div>
    </div>
</template>

<script lang="ts">
import { Card } from "yugioh-deck-tool-core/src/main";
import { defineComponent } from "@vue/composition-api";
import YgoCard from "@/components/YgoCard.vue";
import { PropType } from "vue";
//
// const cardDatabase = applicationContainer.get<CardDatabase>(
//     APPLICATION_TYPES.CardDatabase
// );
// const sortingService = applicationContainer.get<SortingService>(
//     APPLICATION_TYPES.SortingService
// );
// const filterService = applicationContainer.get<FilterService>(
//     APPLICATION_TYPES.FilterService
// );
// const cardService = applicationContainer.get<CardService>(
//     APPLICATION_TYPES.CardService
// );
// const deckService = applicationContainer.get<DeckService>(
//     APPLICATION_TYPES.DeckService
// );

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
    setup(props, context) {
        return {};
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
                padding-left: 0.35rem;
            }

            &:not(:last-child) {
                border-bottom: 1px solid $gray-400;
            }
        }
    }
}
</style>
