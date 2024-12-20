<template>
	<VApp>
		<VMain
			class="ygo-main ga-6"
			:class="loading ? 'ygo-main--loading' : ''"
		>
			<VProgressCircular v-if="loading" color="primary" indeterminate />
			<template v-else>
				<YgoToolbar class="ygo-main__toolbar" />
				<YgoDeck class="ygo-main__deck" />
				<div class="ygo-main__builder">builder</div>
			</template>
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

<style lang="scss">
@use "vuetify";
@use "sass:map";

.ygo-main {
	display: grid;

	grid-template-columns: 1;
	grid-template-rows: min-content 1fr 1fr;
	grid-template-areas:
		"toolbar"
		"deck"
		"builder";

	@media (min-width: map.get(vuetify.$grid-breakpoints, "md")) {
		grid-template-columns: 1fr 340px;
	grid-template-rows: min-content 1fr;
	grid-template-areas:
		"toolbar toolbar"
		"deck builder";
	}

	&__toolbar {
		grid-area: toolbar;
	}
	&__deck {
		grid-area: deck;
	}
	&__builder {
		grid-area: builder;
	}

	&--loading {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
