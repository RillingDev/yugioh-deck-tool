<template>
    <div class="builder">
        <BSidebar id="filterSidebar" title="Filter Cards">
            <template v-slot:header-close>
                <button type="button" aria-label="Close" class="close">
                    ×
                </button>
            </template>
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
        <YgoBuilderMatches
            :matches="filteredCards"
            :can-move="(e) => canMove(e)"
            :drag-group="dragGroup"
        />
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
} from "../../../../core/src/main";
import YgoFilter from "../YgoFilter.vue";
import YgoSortingOptions from "./YgoSortingOptions.vue";
import YgoBuilderMatches from "./YgoBuilderMatches.vue";
import {
    computed,
    defineComponent,
    PropType,
    reactive,
    ref,
} from "@vue/composition-api";
import { appStore } from "../../composition/state/appStore";
import { dataLoaded } from "../../composition/state/dataLoaded";
import { BSidebar } from "bootstrap-vue";

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
        const createDefaultFilter = (): CardFilter => {
            return {
                name: null,

                typeGroup: null,
                type: null,

                subType: null,
                attribute: null,
                level: null,
                linkMarker: [],

                archetype: null,
                format: null,
                banState: null,

                sets: [],
            };
        };
        const filter = reactive<CardFilter>(createDefaultFilter());
        const resetFilter = (): void => {
            const defaultFilter = createDefaultFilter();
            filter.name = defaultFilter.name;

            filter.typeGroup = defaultFilter.typeGroup;
            filter.type = defaultFilter.type;

            filter.subType = defaultFilter.subType;
            filter.attribute = defaultFilter.attribute;
            filter.level = defaultFilter.level;
            filter.linkMarker = defaultFilter.linkMarker;
            filter.archetype = defaultFilter.archetype;

            filter.format = defaultFilter.format;
            filter.banState = defaultFilter.banState;

            filter.sets = defaultFilter.sets;
        };

        const sortingOptions = ref<SortingOptions>({
            strategy: SortingStrategy.DEFAULT,
            order: SortingOrder.DESC,
        });

        const format = computed<Format>(
            () => appStore(context).state.format.active
        );
        const formatCards = computed<Card[]>(() => {
            if (!loaded.value) {
                return [];
            }
            const uniqueCards = cardService
                .getUniqueByName(cardDatabase.getCards())
                .filter((card) => card.type.deckParts.size > 0); // Only show cards that can be added to at least one deck-part
            return filterService.filter(uniqueCards, {
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

        const loaded = dataLoaded(context);

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
@import "../../../../ui/src/styles/variables";
@import "../../../../ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__portal {
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
