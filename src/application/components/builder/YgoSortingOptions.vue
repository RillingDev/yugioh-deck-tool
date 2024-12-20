<template>
	<div class="d-flex ga-2">
		<VSelect
			v-model="sortingStrategy"
			label="Sorting Strategy"
			:items="sortingStrategies"
			@update:model-value="onOptionsChanged"
		/>
		<VSelect
			v-model="sortingOrder"
			label="Sorting Order"
			:items="sortingOrders"
			@update:model-value="onOptionsChanged"
		/>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { ref } from "vue";
import type { SortingOptions } from "@/core/lib";
import { SortingOrder, SortingStrategy } from "@/core/lib";
import { VSelect } from "vuetify/components/VSelect";

const model = defineModel({
	required: true,
	type: Object as PropType<SortingOptions>,
});

const sortingStrategies = Object.values(SortingStrategy);
const sortingStrategy = ref(model.value.strategy);

const sortingOrders = Object.values(SortingOrder);
const sortingOrder = ref(model.value.order);

function onOptionsChanged() {
	model.value = {
		strategy: sortingStrategy.value,
		order: sortingOrder.value,
	};
}
</script>
