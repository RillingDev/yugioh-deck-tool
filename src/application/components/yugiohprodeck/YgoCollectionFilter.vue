<template>
	<div>
		<VCheckbox
			v-model="checked"
			label="Use User Collection"
			@input="reload"
		/>
		<VBtn
			title="Reload the user collection contents"
			:disabled="!checked"
			prepend-icon="fas fa-sync"
			@click="reload"
		>
			Reload
		</VBtn>
		<VAlert v-if="loadingFailed" type="error">
			Failed to load user collection.
		</VAlert>
	</div>
</template>
<script setup lang="ts">
import { ygoprodeckController, ygoprodeckService } from "@/application/ctx";
import { useCollectionStore } from "@/application/store/collection";
import { useDataStore } from "@/application/store/data";
import { getLogger } from "@/core/lib";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { VAlert } from "vuetify/components/VAlert";
import { VBtn } from "vuetify/components/VBtn";
import { VCheckbox } from "vuetify/components/VCheckbox";

const emit = defineEmits<{ change: [] }>();

/**
 * Should only be mounted if running in ygoprodeck env and having credentials available.
 */

const logger = getLogger("YgoCollectionFilter");

const { cardCountFunction } = storeToRefs(useCollectionStore());

const { loading } = storeToRefs(useDataStore());

const loadingFailed = ref(false);

const checked = ref(cardCountFunction.value != null);

// TODO find a way to link ref with vuex state without watch
watch(
	() => cardCountFunction.value,
	() => {
		checked.value = cardCountFunction.value != null;
	},
);

async function loadCollection() {
	if (!checked.value) {
		return null;
	}
	return ygoprodeckService.getCollectionCardCountFunction(
		ygoprodeckController.getCredentials(),
	);
}

function reload() {
	loading.value = true;
	loadCollection()
		.then((loadedCollectionCardCountFunction) => {
			cardCountFunction.value = loadedCollectionCardCountFunction;
		})
		.then(() => emit("change"))
		.catch((err) => {
			logger.error("Could not load user collection!", err);
			loadingFailed.value = true;
		})
		.finally(() => (loading.value = false));
}
</script>
