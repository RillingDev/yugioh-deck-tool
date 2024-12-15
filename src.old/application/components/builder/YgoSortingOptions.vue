<template>
	<form class="form-group sorting-options">
		<label class="sorting-options__label w-50"> Sort by </label>
		<VSelect
			v-model="internalSortingOptions.strategy"
			class="sorting-options__input w-100"
			title="Sorting Strategy"
			:options="sortingStrategies"
			:clearable="false"
			:searchable="false"
			@input="() => onOptionsChanged()"
		/>
		<VSelect
			v-model="internalSortingOptions.order"
			class="sorting-options__input w-100"
			title="Sorting Order"
			:options="sortingOrders"
			:clearable="false"
			:searchable="false"
			@input="() => onOptionsChanged()"
		/>
	</form>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { reactive } from "vue";
import type { SortingOptions } from "@/core/lib";
import { SortingOrder, SortingStrategy } from "@/core/lib";
import { clone } from "lodash";
import VSelect from "vue-select";

// TODO use defineModel
const props = defineProps({
	sortingOptions: {
		required: true,
		type: Object as PropType<SortingOptions>,
	},
});
const emit = defineEmits(["update:sortingOptions"]);

const internalSortingOptions = reactive<SortingOptions>(
	clone(props.sortingOptions),
);

const sortingStrategies = Object.values(SortingStrategy);
const sortingOrders = Object.values(SortingOrder);

const onOptionsChanged = (): void =>
	emit("update:sortingOptions", clone(internalSortingOptions));
</script>
<style lang="scss">
@import "../../../browser-common/styles/variables";
@import "../../../browser-common/styles/mixins";

.deck-tool {
	.sorting-options {
		display: flex;
		flex-direction: column;

		gap: $margin-md;

		margin-bottom: $margin-md;

		@include screen-min-width(md) {
			flex-direction: row;
			align-items: center;
		}

		&__label {
			margin: 0;
		}
	}
}
</style>
