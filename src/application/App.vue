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
import type { CardDatabase } from "@/core/lib";
import { getLogger, TYPES } from "@/core/lib";

import { applicationContainer } from "./inversify.config";
import { APPLICATION_TYPES } from "./types";
import { DECK_REPLACE } from "./store/modules/deck";
import { computed, defineComponent, onMounted } from "vue";
import { BOverlay } from "bootstrap-vue";
import { showError } from "./composition/feedback";
import YgoDeck from "./components/deck/YgoDeck.vue";
import YgoBuilder from "./components/builder/YgoBuilder.vue";
import YgoToolbar from "./components/toolbar/YgoToolbar.vue";
import type { DeckUrlController } from "./controller/DeckUrlController";
import { ESSENTIAL_DATA_LOADED, SET_LOADING } from "./store/modules/data";
import { useStore } from "./store/store";

const cardDatabase = applicationContainer.get<CardDatabase>(TYPES.CardDatabase);
const deckUrlController = applicationContainer.get<DeckUrlController>(
	APPLICATION_TYPES.DeckUrlController
);

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
	setup(props, context) {
		const store = useStore();

		const loading = computed<boolean>(() => store.state.data.loading);

		const dragGroup = "GLOBAL_CARD_DRAG_GROUP";

		onMounted(() => {
			Promise.resolve()
				.then(() => store.commit(SET_LOADING, { loading: true }))
				.then(() => cardDatabase.prepareAll())
				.then(() => store.commit(ESSENTIAL_DATA_LOADED))
				.then(() => {
					logger.info("Loaded data.");
					return deckUrlController.loadUriDeck(
						new URL(location.href)
					);
				})
				.then((result) => {
					if (result != null) {
						store.commit(DECK_REPLACE, { deck: result });
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
						context,
						"Could not start the application!",
						"deck-tool__portal"
					);
				})
				.finally(() => store.commit(SET_LOADING, { loading: false }));
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
