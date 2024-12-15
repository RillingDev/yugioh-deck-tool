<template>
	<div class="toolbar form-group">
		<div role="group" class="toolbar__items">
			<YgoBuyLink />
		</div>

		<div class="toolbar__items" role="group">
			<YgoDeckName class="w-100" />
			<YgoFormat class="w-50" />
		</div>
	</div>
</template>

<script setup lang="ts">
import YgoFormat from "./YgoFormat.vue";
import YgoDeckName from "./YgoDeckName.vue";
import YgoBuyLink from "./YgoBuyLink.vue";

import { useDataStore } from "@/application/store/data";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";

const { deckEmpty } = storeToRefs(useDeckStore());

const { essentialDataLoaded } = storeToRefs(useDataStore());
</script>

<style lang="scss">
@import "../../../browser-common/styles/variables";
@import "../../../browser-common/styles/mixins";

.deck-tool {
	.toolbar__items {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;

		gap: $margin-md;

		margin-bottom: $margin-md;

		@include screen-min-width(lg) {
			flex-direction: row;
		}
	}
}
</style>
