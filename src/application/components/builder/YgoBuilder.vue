<template>
	<div class="ygo-builder">
		<div class="position-sticky top-0">
			<YgoSortingOptions
				v-model:strategy="sortingOptions.strategy"
				v-model:order="sortingOptions.order"
			/>
			<VExpansionPanels class="mb-4">
				<VExpansionPanel title="Filter">
					<template #text>
						<YgoFilter
							v-model:name="filter.name"
							v-model:description="filter.description"
							v-model:type-category="filter.typeCategory"
							v-model:type="filter.type"
							v-model:sub-type="filter.subType"
							v-model:attribute="filter.attribute"
							v-model:level="filter.level"
							v-model:link-markers="filter.linkMarkers"
							v-model:archetype="filter.archetype"
							v-model:ban-state="filter.banState"
							v-model:sets="filter.sets"
						/>
					</template>
				</VExpansionPanel>
			</VExpansionPanels>
			<p>
				<small>
					Result: {{ filteredCards.length }} of
					{{ formatCards.length }} Cards
				</small>
			</p>
			<YgoBuilderMatches :matches="filteredCards" />
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	cardDatabase,
	cardPredicateService,
	filterService,
	sortingService,
} from "@/application/ctx";
import { useDataStore } from "@/application/store/data";
import { useFormatStore } from "@/application/store/format";
import type { CardFilter, SortingOptions } from "@/core/lib";
import { SortingOrder, SortingStrategy } from "@/core/lib";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import {
	VExpansionPanel,
	VExpansionPanels,
} from "vuetify/components/VExpansionPanel";
import YgoBuilderMatches from "./YgoBuilderMatches.vue";
import YgoFilter from "./YgoFilter.vue";
import YgoSortingOptions from "./YgoSortingOptions.vue";

const filter = ref<CardFilter>({
	customPredicates: [],

	name: null,
	description: null,

	typeCategory: null,
	type: null,
	subType: null,

	attribute: null,
	level: null,
	linkMarkers: [],

	archetype: null,
	banState: null,

	sets: [],
});

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
