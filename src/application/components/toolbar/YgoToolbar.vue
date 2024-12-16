<template>
	<div class="toolbar form-group">
		<VToolbar>
			<VToolbarItems>
				<YgoImport :disabled="!essentialDataLoaded" />
				<YgoExport :disabled="!essentialDataLoaded || deckEmpty" />
				<VBtn
					prepend-icon="fas fa-edit"
					:disabled="!essentialDataLoaded || deckEmpty"
				>
					Edit
				</VBtn>
				<VBtn
					prepend-icon="fas fa-magic"
					:disabled="!essentialDataLoaded"
				>
					Simulate
				</VBtn>
				<YgoBuyLink />
			</VToolbarItems>
		</VToolbar>

		<div class="toolbar__items" role="group">
			<YgoDeckName />
			<YgoFormat />
		</div>
	</div>
</template>

<script setup lang="ts">
import YgoFormat from "./YgoFormat.vue";
import YgoDeckName from "./YgoDeckName.vue";
import YgoBuyLink from "./YgoBuyLink.vue";
import YgoImport from "./YgoImport.vue";
import YgoExport from "./YgoExport.vue";

import { useDataStore } from "@/application/store/data";
import { useDeckStore } from "@/application/store/deck";
import { VToolbar, VToolbarItems } from "vuetify/components/VToolbar";
import { VBtn } from "vuetify/components/VBtn";
import { storeToRefs } from "pinia";

const { deckEmpty } = storeToRefs(useDeckStore());

const { essentialDataLoaded } = storeToRefs(useDataStore());
</script>

<style lang="scss"></style>
