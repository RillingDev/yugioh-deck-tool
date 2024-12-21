<template>
	<div class="ygo-builder">
		<div class="position-sticky top-0">
			<div>
				<small>
					Result: {{ filteredCards.length }} of
					{{ formatCards.length }} Cards
				</small>
				<YgoFilter v-model="filter" />
			</div>
			<YgoSortingOptions v-model="sortingOptions" />
			<YgoBuilderMatches :matches="filteredCards" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { SortingOptions } from "@/core/lib";
import { SortingOrder, SortingStrategy } from "@/core/lib";
import YgoSortingOptions from "./YgoSortingOptions.vue";
import YgoBuilderMatches from "./YgoBuilderMatches.vue";
import { computed, ref } from "vue";
import { useDataStore } from "@/application/store/data";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";
import {
	cardDatabase,
	cardPredicateService,
	filterService,
	sortingService,
} from "@/application/ctx";
import YgoFilter from "../YgoFilter.vue";

const filter = ref(filterService.createDefaultFilter());

const sortingOptions = ref<SortingOptions>({
	strategy: SortingStrategy.DEFAULT,
	order: SortingOrder.DESC,
});

const { essentialDataLoaded } = storeToRefs(useDataStore());
const { format } = storeToRefs(useFormatStore());

const formatCards = computed(() => {
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
const filteredCards = computed(() => {
	const filtered = filterService.filter(formatCards.value, {
		...filter.value,
		format: format.value,
	});
	return sortingService.sort(filtered, sortingOptions.value);
});
</script>

<style lang="scss"></style>
