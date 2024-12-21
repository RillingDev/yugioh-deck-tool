<template>
	<div class="d-flex ga-2">
		<VSelect
			v-model="strategy"
			:items="allStrategies"
			label="Sorting Strategy"
		/>
		<VSelect v-model="order" :items="allOrders" label="Sorting Order" />
	</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { SortingOrder, SortingStrategy } from "@/core/lib";
import { VSelect } from "vuetify/components/VSelect";

const strategy = defineModel("strategy", {
	required: true,
	type: String as PropType<SortingStrategy>,
});
const order = defineModel("order", {
	required: false,
	type: String as PropType<SortingOrder>,
});

const allStrategies = Object.values(SortingStrategy);
const allOrders = Object.values(SortingOrder);
</script>
