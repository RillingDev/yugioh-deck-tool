<template>
	<div>
		<VToolbar>
			<VToolbarItems>
				<YgoDeckClear />
				<YgoDeckSort />
				<YgoImport />
				<YgoExport />
				<YgoDrawSim />
				<YgoBuyLink />
			</VToolbarItems>
		</VToolbar>

		<div>
			<YgoDeckName />
			<YgoFormat />
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
import { VToolbar, VToolbarItems } from "vuetify/components/VToolbar";
</script>

<style lang="scss"></style>
