<template>
	<VApp>
		<VMain
			class="ygo-main ga-6"
			:class="loading || startupFailed ? 'ygo-main--not-ready' : ''"
		>
			<VAlert v-if="startupFailed" type="error" :max-width="500">
				Failed to start the application. Please check the developer
				console for details.
			</VAlert>
			<VProgressCircular
				v-else-if="loading"
				color="primary"
				indeterminate
			/>
			<template v-else>
				<YgoToolbar class="ygo-main__toolbar" />
				<YgoDeck class="ygo-main__deck" />
				<YgoBuilder class="ygo-main__builder" />
			</template>
		</VMain>
	</VApp>
</template>

<script setup lang="ts">
import { cardDatabase, deckUrlController } from "@/application/ctx";
import { useDataStore } from "@/application/store/data";
import { useDeckStore } from "@/application/store/deck";
import { getLogger } from "@/core/lib";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { VAlert } from "vuetify/components/VAlert";
import { VApp } from "vuetify/components/VApp";
import { VMain } from "vuetify/components/VMain";
import { VProgressCircular } from "vuetify/components/VProgressCircular";
import YgoBuilder from "./components/builder/YgoBuilder.vue";
import YgoDeck from "./components/deck/YgoDeck.vue";
import YgoToolbar from "./components/toolbar/YgoToolbar.vue";

// TODO: double-check general accessibility
// TODO: merge tooltip

const logger = getLogger("App");

const { loading, essentialDataLoaded } = storeToRefs(useDataStore());
const deckStore = useDeckStore();

const startupFailed = ref(false);

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
			startupFailed.value = true;
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

	&--not-ready {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
