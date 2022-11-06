<template>
	<BOverlay :show="loading">
		<div class="deck-tool__body">
			<div class="deck-tool__body__primary">
				<YgoToolbar />
				<hr />
				<YgoDeck v-show="!loading" :drag-group="dragGroup" />
			</div>
			<div class="deck-tool__body__secondary">
				<YgoBuilder :drag-group="dragGroup" />
			</div>
		</div>
	</BOverlay>
</template>

<script lang="ts">
import { getLogger } from "@/core/lib";

import { defineComponent, onMounted } from "vue";
import { BOverlay } from "bootstrap-vue";
import { showError, useToast } from "./composition/feedback";
import YgoDeck from "./components/deck/YgoDeck.vue";
import YgoBuilder from "./components/builder/YgoBuilder.vue";
import YgoToolbar from "./components/toolbar/YgoToolbar.vue";
import { useDataStore } from "@/application/store/data";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { cardDatabase, deckUrlController } from "@/application/container";

const logger = getLogger("App");

export default defineComponent({
	components: {
		BOverlay,
		YgoDeck,
		YgoBuilder,
		YgoToolbar,
	},
	props: {},
	emits: [],
	setup() {
		const { loading, essentialDataLoaded } = storeToRefs(useDataStore());
		const deckStore = useDeckStore();

		const toast = useToast();

		const dragGroup = "GLOBAL_CARD_DRAG_GROUP";

		onMounted(() => {
			Promise.resolve()
				.then(() => (loading.value = true))
				.then(() => cardDatabase.prepareAll())
				.then(() => (essentialDataLoaded.value = true))
				.then(() => {
					logger.info("Loaded data.");
					return deckUrlController.loadUriDeck(
						new URL(location.href)
					);
				})
				.then((result) => {
					if (result != null) {
						deckStore.replace({ deck: result });
						logger.info("Loaded deck from URI.");
					} else {
						logger.info(
							"No URI deck loaded, starting with empty deck."
						);
					}
				})
				.catch((err) => {
					logger.error("Could not start the application!", err);
					showError(
						toast,
						"Could not start the application!",
						"deck-tool__portal"
					);
				})
				.finally(() => (loading.value = false));
		});

		return {
			loading,

			dragGroup,
		};
	},
});
</script>
<style lang="scss">
@import "../browser-common/styles/mixins";
@import "../browser-common/styles/variables";

.deck-tool {
	.deck-tool__body {
		display: flex;
		flex-direction: column;

		&__primary {
			width: 100%;
		}

		&__secondary {
			width: 100%;
		}

		@include screen-min-width(md) {
			flex-direction: row;

			&__secondary {
				max-width: 340px;
				margin-left: $margin-lg;
			}
		}
	}
}
</style>
