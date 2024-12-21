<template>
	<div class="builder">
		<BSidebar id="filterSidebar" title="Filter Cards">
			<div class="container">
				<YgoFilter
					:filter="filter"
					@update:filter="(newFilter) => (filter = newFilter)"
				/>
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
		<YgoSortingOptions
			:sorting-options="sortingOptions"
			@update:sorting-options="
				(newOptions) => (sortingOptions = newOptions)
			"
		/>
		<YgoBuilderMatches
			:matches="filteredCards"
			:drag-group="props.dragGroup"
		/>
	</div>
</template>

<script setup lang="ts">
import type { Card, CardFilter, SortingOptions } from "@/core/lib";
import { SortingOrder, SortingStrategy } from "@/core/lib";
import YgoFilter from "../YgoFilter.vue";
import YgoSortingOptions from "./YgoSortingOptions.vue";
import YgoBuilderMatches from "./YgoBuilderMatches.vue";
import type { PropType } from "vue";
import { computed, ref } from "vue";
import { BSidebar } from "bootstrap-vue";
import { useDataStore } from "@/application/store/data";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";
import {
	cardDatabase,
	cardPredicateService,
	filterService,
	sortingService,
} from "@/application/ctx";

const props = defineProps({
	dragGroup: {
		required: true,
		type: String as PropType<string>,
	},
});
const filter = ref<CardFilter>(filterService.createDefaultFilter());

const sortingOptions = ref<SortingOptions>({
	strategy: SortingStrategy.DEFAULT,
	order: SortingOrder.DESC,
});

const { essentialDataLoaded } = storeToRefs(useDataStore());
const { format } = storeToRefs(useFormatStore());

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
