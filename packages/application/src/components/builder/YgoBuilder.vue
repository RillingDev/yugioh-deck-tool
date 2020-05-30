<template>
    <div class="builder">
        <YgoFilter :show-advanced="true" v-model="reactiveFilter" />
        <hr />
        <small class="builder__count">
            Showing {{ filteredCards.length }} of {{ formatCards.length }} Cards
        </small>
        <YgoSortingOptions v-model="reactiveSortingOptions" />

        <div class="builder__matches">
            <Draggable
                tag="ol"
                class="builder__matches__list"
                :group="{ name: 'cards', pull: 'clone', put: false }"
                :list="filteredCards"
                :sort="false"
                :move="canMove"
                v-show="filteredCards.length > 0"
            >
                <li
                    class="builder__matches__match"
                    v-for="card in filteredCards"
                    :key="card.passcode"
                >
                    <YgoBuilderMatch :card="card" />
                </li>
            </Draggable>
            <div
                class="builder__matches__no-matches"
                v-show="filteredCards.length === 0"
            >
                No matches found.
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import {
    Card,
    CardDatabase,
    CardFilter,
    CardService,
    FilterService,
    Format,
    SortingOptions,
    SortingOrder,
    SortingService,
    SortingStrategy,
} from "yugioh-deck-tool-core/src/main";
import YgoFilter from "../YgoFilter.vue";
import YgoSortingOptions from "./YgoSortingOptions.vue";
import YgoBuilderMatch from "./YgoBuilderMatch.vue";
import { computed, defineComponent, ref } from "@vue/composition-api";
import { merge } from "lodash";
import { PropType } from "vue";
import Draggable from "vuedraggable";

const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);
const sortingService = applicationContainer.get<SortingService>(
    APPLICATION_TYPES.SortingService
);
const filterService = applicationContainer.get<FilterService>(
    APPLICATION_TYPES.FilterService
);
const cardService = applicationContainer.get<CardService>(
    APPLICATION_TYPES.CardService
);

export default defineComponent({
    props: {
        canMove: {
            required: true,
            type: Function as PropType<(e: object) => boolean>,
        },
    },
    components: {
        YgoFilter,
        YgoSortingOptions,
        YgoBuilderMatch,
        Draggable,
    },
    setup(props, context) {
        const CARD_DISPLAY_LIMIT = 100;

        const reactiveFilter = ref<CardFilter>({
            name: null,

            typeGroup: null,
            type: null,

            subType: null,
            attribute: null,
            level: null,
            linkMarker: null,
            archetype: null,

            format: null,
            banState: null,

            sets: [],
        });
        const reactiveSortingOptions = ref<SortingOptions>({
            strategy: SortingStrategy.NAME,
            order: SortingOrder.DESC,
        });

        const format = computed<Format>(
            () => context.root.$store.state.format.active
        );
        const formatCards = computed<Card[]>(() =>
            filterService.filter(
                cardService.getUniqueByName(cardDatabase.getCards()),
                { format: format.value }
            )
        );
        const filteredCards = computed<Card[]>(() => {
            const filtered = filterService.filter(
                formatCards.value,
                merge(reactiveFilter.value, {
                    format: format.value,
                })
            );
            const sorted = sortingService.sort(
                filtered,
                reactiveSortingOptions.value
            );
            return sorted.slice(0, CARD_DISPLAY_LIMIT);
        });

        return {
            reactiveFilter,
            reactiveSortingOptions,

            formatCards,
            filteredCards,
        };
    },
});
</script>

<style lang="scss">
@import "../../../../../node_modules/yugioh-deck-tool-ui/src/styles/variables";
@import "../../../../../node_modules/yugioh-deck-tool-ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__modal {
    .builder {
        &__count {
            display: inline-block;
            margin-bottom: 0.5rem;
        }

        &__matches {
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
        }
    }
}
</style>
