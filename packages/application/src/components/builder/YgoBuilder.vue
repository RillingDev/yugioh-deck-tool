<template>
    <div class="builder">
        <YgoFilter v-model="filter" v-if="loaded" />
        <hr />
        <small class="builder__count">
            Showing {{ filteredCards.length }} of {{ formatCards.length }} Cards
        </small>
        <YgoSortingOptions v-model="sortingOptions" />
        <YgoBuilderMatches
            :matches="filteredCards"
            :can-move="(e) => canMove(e)"
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
import YgoBuilderMatch from "./YgoBuilderMatches.vue";
import { computed, defineComponent, PropType, ref } from "@vue/composition-api";
import Draggable from "vuedraggable";
import { appStore } from "../../composition/appStore";
import { dataLoaded } from "../../composition/dataLoaded";
import YgoBuilderMatches from "./YgoBuilderMatches.vue";

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
        YgoBuilderMatches,
    },
    setup(props, context) {
        const CARD_DISPLAY_LIMIT = 100;

        const filter = ref<CardFilter>({
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
        const sortingOptions = ref<SortingOptions>({
            strategy: SortingStrategy.NAME,
            order: SortingOrder.DESC,
        });

        const format = computed<Format>(
            () => appStore(context).state.format.active
        );
        const formatCards = computed<Card[]>(() => {
            if (!loaded.value) {
                return [];
            }
            return filterService.filter(
                cardService.getUniqueByName(cardDatabase.getCards()),
                { format: format.value }
            );
        });
        const filteredCards = computed<Card[]>(() => {
            const filtered = filterService.filter(formatCards.value, {
                ...filter.value,
                format: format.value,
            });
            const sorted = sortingService.sort(filtered, sortingOptions.value);
            return sorted.slice(0, CARD_DISPLAY_LIMIT);
        });
        const loaded = dataLoaded(context);

        return {
            filter,
            sortingOptions,

            loaded,
            formatCards,
            filteredCards,
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
        &__count {
            display: inline-block;
            margin-bottom: 0.5rem;
        }
    }
}
</style>
