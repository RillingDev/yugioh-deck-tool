<template>
    <div class="builder">
        <BSidebar id="filterSidebar" title="Filter Cards">
            <div class="container">
                <YgoFilter v-model="filter" v-if="loaded" />
                <button class="btn btn-danger" @click="() => resetFilter()">
                    <span
                        class="fas fas-in-button fa-trash"
                        aria-hidden="true"
                    ></span>
                    Reset Filter
                </button>
            </div>
        </BSidebar>
        <div class="builder__details">
            <small class="builder__count">
                Result: {{ filteredCards.length }} of
                {{ formatCards.length }} Cards
            </small>
            <button class="btn btn-primary" v-b-toggle.filterSidebar>
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
import { APPLICATION_TYPES } from "../../types";
import type {
    Card,
    CardDatabase,
    CardFilter,
    FilterService,
    Format,
    SortingOptions,
    SortingService,
} from "../../../../core/src/main";
import {
    SortingOrder,
    SortingStrategy,
    TYPES,
} from "../../../../core/src/main";
import YgoFilter from "../YgoFilter.vue";
import YgoSortingOptions from "./YgoSortingOptions.vue";
import YgoBuilderMatches from "./YgoBuilderMatches.vue";
import type { PropType } from "@vue/composition-api";
import { computed, defineComponent, reactive, ref } from "@vue/composition-api";
import { appStore } from "../../composition/state/appStore";
import { dataLoaded } from "../../composition/state/dataLoaded";
import { BSidebar } from "bootstrap-vue";
import type { FilterController } from "../../controller/FilterController";

const cardDatabase = applicationContainer.get<CardDatabase>(TYPES.CardDatabase);
const sortingService = applicationContainer.get<SortingService>(
    TYPES.SortingService
);
const filterService = applicationContainer.get<FilterService>(
    TYPES.FilterService
);
const filterController = applicationContainer.get<FilterController>(
    APPLICATION_TYPES.FilterController
);

const createDefaultFilter = (): CardFilter => {
    return {
        name: null,

        typeCategory: null,
        type: null,
        subType: null,

        attribute: null,
        level: null,
        linkMarkers: [],

        archetype: null,
        format: null,
        banState: null,

        sets: [],
    };
};

export default defineComponent({
    props: {
        dragGroup: {
            required: true,
            type: String as PropType<string>,
        },
    },
    components: {
        YgoFilter,
        YgoSortingOptions,
        YgoBuilderMatches,
        BSidebar,
    },
    setup(props, context) {
        // We have to init all properties even if they are optional, because otherwise vue cant listen to changes.
        const filter = reactive<CardFilter>(createDefaultFilter());
        const resetFilter = (): void => {
            Object.assign(filter, createDefaultFilter());
        };

        const sortingOptions = ref<SortingOptions>({
            strategy: SortingStrategy.DEFAULT,
            order: SortingOrder.DESC,
        });

        const loaded = dataLoaded(context);

        const format = computed<Format | null>(
            () => appStore(context).state.format.active
        );

        const formatCards = computed<Card[]>(() => {
            // Required to ensure render after loading.
            if (!loaded.value) {
                return [];
            }
            return filterService.filter(cardDatabase.getCards(), {
                customPredicates: [
                    filterController.createAddableInAtLeastOneDeckPartCardPredicate(),
                    filterController.createUniqueByNameCardPredicate(),
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

            loaded,
            formatCards,
            filteredCards,

            resetFilter,
        };
    },
});
</script>

<style lang="scss">
@import "../../../../browser-common/src/styles/variables";
@import "../../../../browser-common/src/styles/mixins";

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
