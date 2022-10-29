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
} from "@/core/lib";
import { SortingOrder, SortingStrategy, TYPES } from "@/core/lib";
import YgoFilter from "../YgoFilter.vue";
import YgoSortingOptions from "./YgoSortingOptions.vue";
import YgoBuilderMatches from "./YgoBuilderMatches.vue";
import type { PropType } from "vue";
import { computed, defineComponent, ref } from "vue";
import { BSidebar } from "bootstrap-vue";
import { useStore } from "../../store/store";

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
	setup() {
		const filter = ref<CardFilter>(filterService.createDefaultFilter());

		const sortingOptions = ref<SortingOptions>({
			strategy: SortingStrategy.DEFAULT,
			order: SortingOrder.DESC,
		});

		const store = useStore();

		const essentialDataLoaded = computed<boolean>(
			() => store.state.data.essentialDataLoaded
		);

		const format = computed<Format | null>(() => store.state.format.active);

		const formatCards = computed<Card[]>(() => {
			// Required to ensure render after loading.
			if (!essentialDataLoaded.value) {
				return [];
			}
			return filterService.filter(cardDatabase.getCards(), {
				customPredicates: [
					cardPredicateService.createAddableInAtLeastOneDeckPartCardPredicate(),
					...(filter.value.customPredicates ?? []),
					cardPredicateService.createUniqueByNameCardPredicate(),
				],
				format: format.value,
			});
		});
		const filteredCards = computed<Card[]>(() => {
			const filtered = filterService.filter(formatCards.value, {
				...filter.value,
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
@import "../../../browser-common/styles/variables";
@import "../../../browser-common/styles/mixins";

.deck-tool {
	.builder {
		position: sticky;
		top: 0.5rem;

		&__details {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: $margin-md;
		}
	}
}
</style>
