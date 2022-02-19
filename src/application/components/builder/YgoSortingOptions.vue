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

<script lang="ts">
import type { PropType } from "@vue/composition-api";
import { defineComponent, reactive } from "@vue/composition-api";
import type { SortingOptions } from "@/core/main";
import { SortingOrder, SortingStrategy } from "@/core/main";
import { clone } from "lodash";
import VSelect from "vue-select";

export default defineComponent({
	components: {
		VSelect,
	},
	model: {
		prop: "sortingOptions",
		event: "change",
	},
	props: {
		sortingOptions: {
			required: true,
			type: Object as PropType<SortingOptions>,
		},
	},
	emits: ["change"],
	setup(props, context) {
		const internalSortingOptions = reactive<SortingOptions>(
			clone(props.sortingOptions)
		);

		const sortingStrategies = Object.values(SortingStrategy);
		const sortingOrders = Object.values(SortingOrder);

		const onOptionsChanged = (): void =>
			context.emit("change", clone(internalSortingOptions));

		return {
			sortingStrategies,
			sortingOrders,

			internalSortingOptions,

			onOptionsChanged,
		};
	},
});
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
