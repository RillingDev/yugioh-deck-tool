<template>
    <div class="builder">
        <YgoFilter :show-advanced="true" v-model="reactiveFilter" />
        <hr />
        <small class="builder__count">
            Showing {{ filteredCards.length }} of {{ formatCards.length }} Cards
        </small>
        <YgoSortingOptions v-model="reactiveSortingOptions" />
        <YgoBuilderMatches :cards="filteredCards" />
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
import YgoBuilderMatches from "./YgoBuilderMatches.vue";
import { computed, defineComponent, ref } from "@vue/composition-api";
import { merge } from "lodash";

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
    props: {},
    components: {
        YgoFilter,
        YgoSortingOptions,
        YgoBuilderMatches,
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
    }
}
</style>
