<template>
	<VApp>
		<VMain>
			<VProgressCircular v-if="loading" />
			<div v-else>
				<div>
					<YgoToolbar />
					<hr />
					<YgoDeck v-show="!loading" />
				</div>
				<div>builder</div>
			</div>
		</VMain>
	</VApp>
</template>

<script setup lang="ts">
import { VApp } from "vuetify/components/VApp";
import { VMain } from "vuetify/components/VMain";
import { VProgressCircular } from "vuetify/components/VProgressCircular";
import YgoToolbar from "./components/toolbar/YgoToolbar.vue";
import YgoDeck from "./components/deck/YgoDeck.vue";
import { getLogger } from "@/core/lib";
import { onMounted } from "vue";
import { showError, useToast } from "@/application/composition/feedback";
import { useDataStore } from "@/application/store/data";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { cardDatabase, deckUrlController } from "@/application/ctx";

const logger = getLogger("App");
const { loading, essentialDataLoaded } = storeToRefs(useDataStore());
const deckStore = useDeckStore();

const toast = useToast();

onMounted(() => {
	Promise.resolve()
		.then(() => (loading.value = true))
		.then(() => cardDatabase.prepareAll())
		.then(() => (essentialDataLoaded.value = true))
		.then(() => {
			logger.info("Loaded data.");
			return deckUrlController.loadUriDeck(new URL(location.href));
		})
		.then((result) => {
			if (result != null) {
				deckStore.replace({ deck: result });
				logger.info("Loaded deck from URI.");
			} else {
				logger.info("No URI deck loaded, starting with empty deck.");
			}
		})
		.catch((err) => {
			logger.error("Could not start the application!", err);
			showError(
				toast,
				"Could not start the application!",
				"deck-tool__portal",
			);
		})
		.finally(() => (loading.value = false));
});
</script>

<style lang="scss"></style>
