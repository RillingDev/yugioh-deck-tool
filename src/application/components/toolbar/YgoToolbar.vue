<template>
	<div class="ygo-toolbar ga-2">
		<div class="ygo-toolbar__name">
			<YgoDeckName />
		</div>
		<div class="ygo-toolbar__format">
			<YgoFormat />
		</div>
		<div class="ygo-toolbar__tools d-flex flex-wrap ga-2">
			<YgoDeckClear />
			<YgoDeckSort />
			<YgoImport />
			<YgoExport />
			<YgoDrawSim />
			<YgoBuyLink />
		</div>
	</div>
</template>

<script setup lang="ts">
import YgoFormat from "./YgoFormat.vue";
import YgoDeckName from "./YgoDeckName.vue";
import YgoBuyLink from "./YgoBuyLink.vue";
import YgoDrawSim from "./YgoDrawSimButton.vue";
import YgoImport from "./YgoDeckImportButton.vue";
import YgoExport from "./YgoDeckExportButton.vue";
import YgoDeckClear from "./YgoDeckClearButton.vue";
import YgoDeckSort from "./YgoDeckSortButton.vue";
</script>

<style lang="scss">
@use "vuetify";
@use "sass:map";

.ygo-toolbar {
	display: grid;

	grid-template-columns: 2fr 1fr;
	grid-template-rows: 1fr 1fr;
	grid-template-areas:
		"name format"
		"tools tools";

	@media (min-width: map.get(vuetify.$grid-breakpoints, "lg")) {
		grid-template-columns:
			minmax(250px, 1fr) minmax(200px, 1fr)
			1fr max-content;
		grid-template-rows: 1fr;
		grid-template-areas: "name format . tools";
	}

	&__name {
		grid-area: name;
	}
	&__format {
		grid-area: format;
	}
	&__tools {
		grid-area: tools;
	}
}
</style>
