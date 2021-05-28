<template>
    <div class="builder">
        <BSidebar id="filterSidebar" title="Filter Cards">
            <div class="container">
                <YgoFilter v-model="filter" />
            </div>
        </BSidebar>
        <div class="builder__details">
            <small class="builder__count">
                Result: {{ filteredCards.length }} of
                {{ formatCards.length }} Cards
            </small>
            <button v-b-toggle.filterSidebar class="btn btn-primary">
                <span
                    class="fas fas-in-button fa-search"
                    aria-hidden="true"
                ></span>
                Filter Cards
            </button>
        </div>
        <YgoSortingOptions v-model="sortingOptions" />
        <YgoBuilderMatches :matches="filteredCards" :drag-group="dragGroup" />
    </div>
</template>

<script lang="ts">
import { applicationContainer } from "../../inversify.config";
import type {
    Card,
    CardDatabase,
    CardFilter,
    CardPredicateService,
    FilterService,
    Format,
    SortingOptions,
    SortingService,
} from "@yugioh-deck-tool/core";
import { SortingOrder, SortingStrategy, TYPES } from "@yugioh-deck-tool/core";
import YgoFilter from "../YgoFilter.vue";
import YgoSortingOptions from "./YgoSortingOptions.vue";
import YgoBuilderMatches from "./YgoBuilderMatches.vue";
import type { PropType } from "@vue/composition-api";
import { computed, defineComponent, reactive, ref } from "@vue/composition-api";
import { useAppStore } from "../../composition/state/useAppStore";
import { BSidebar } from "bootstrap-vue";
import { useEssentialDataLoaded } from "../../composition/loading";

const cardDatabase = applicationContainer.get<CardDatabase>(TYPES.CardDatabase);
const sortingService = applicationContainer.get<SortingService>(
    TYPES.SortingService
);
const filterService = applicationContainer.get<FilterService>(
    TYPES.FilterService
);
const cardPredicateService = applicationContainer.get<CardPredicateService>(
    TYPES.CardPredicateService
);

export default defineComponent({
    components: {
        YgoFilter,
        YgoSortingOptions,
        YgoBuilderMatches,
        BSidebar,
    },
    props: {
        dragGroup: {
            required: true,
            type: String as PropType<string>,
        },
    },
    emits: [],
    setup(props, context) {
        // We have to init all properties even if they are optional, because otherwise vue cant listen to changes.
        const filter = reactive<CardFilter>(
            filterService.createDefaultFilter()
        );

        const sortingOptions = ref<SortingOptions>({
            strategy: SortingStrategy.DEFAULT,
            order: SortingOrder.DESC,
        });

        const essentialDataLoaded = useEssentialDataLoaded(context);

        const format = computed<Format | null>(
            () => useAppStore(context).state.format.active
        );

        const formatCards = computed<Card[]>(() => {
            // Required to ensure render after loading.
            if (!essentialDataLoaded.value) {
                return [];
            }
            return filterService.filter(cardDatabase.getCards(), {
                customPredicates: [
                    cardPredicateService.createAddableInAtLeastOneDeckPartCardPredicate(),
                    ...(filter.customPredicates ?? []),
                    cardPredicateService.createUniqueByNameCardPredicate(),
                ],
                format: format.value,
            });
        });
        const filteredCards = computed<Card[]>(() => {
            const filtered = filterService.filter(formatCards.value, {
                ...filter,
                format: format.value,
            });
            return sortingService.sort(filtered, sortingOptions.value);
        });

        return {
            filter,
            sortingOptions,
            essentialDataLoaded,

            formatCards,
            filteredCards,
        };
    },
});
</script>

<style lang="scss">
@import "~@yugioh-deck-tool/browser-common/src/styles/variables";
@import "~@yugioh-deck-tool/browser-common/src/styles/mixins";

.deck-tool {
    .builder {
        &__details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: $margin-md;
        }
    }
}
</style>
