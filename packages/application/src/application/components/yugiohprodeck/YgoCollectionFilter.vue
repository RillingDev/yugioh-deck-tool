<template>
	<div class="form-group collection-filter">
		<BFormCheckbox v-model="checked" @input="() => reload()"
			>Use User Collection
		</BFormCheckbox>
		<button
			class="btn btn-primary btn-sm"
			title="Reload the User Collection contents"
			:disabled="!checked"
			@click="() => reload()"
		>
			<span class="fas fa-sync fas-in-button" aria-hidden="true"></span>
			Reload
		</button>
	</div>
</template>

<script lang="ts">
import type { CardCountFunction } from "@yugioh-deck-tool/core";
import { getLogger } from "@yugioh-deck-tool/core";
import { computed, defineComponent, ref, watch } from "@vue/composition-api";
import { applicationContainer } from "../../inversify.config";
import { BFormCheckbox } from "bootstrap-vue";
import { showError } from "../../composition/feedback";
import { APPLICATION_TYPES } from "../../types";
import type { YgoprodeckController } from "../../controller/YgoprodeckController";
import type { YgoprodeckService } from "@yugioh-deck-tool/ygoprodeck";
import { YGOPRODECK_TYPES } from "@yugioh-deck-tool/ygoprodeck";
import { SET_CARD_COUNT_FUNCTION } from "../../store/modules/collection";
import { useStore } from "../../store/store";
import { SET_LOADING } from "../../store/modules/data";

const ygoprodeckService = applicationContainer.get<YgoprodeckService>(
	YGOPRODECK_TYPES.YgoprodeckService
);
const ygoprodeckController = applicationContainer.get<YgoprodeckController>(
	APPLICATION_TYPES.YgoprodeckController
);

const logger = getLogger("YgoCollectionFilter");

/**
 * Should only be mounted if running in ygoprodeck env and having credentials available.
 */
export default defineComponent({
	components: { BFormCheckbox },
	props: {},
	emits: ["change"],
	setup(props, context) {
		const store = useStore();

		const cardCountFunction = computed<CardCountFunction | null>({
			get: () => store.state.collection.cardCountFunction,
			set: (newCardCountFunction) =>
				store.commit(SET_CARD_COUNT_FUNCTION, {
					cardCountFunction: newCardCountFunction,
				}),
		});

		const checked = ref<boolean>(cardCountFunction.value != null);

		// TODO find a way to link ref with vuex state without watch
		watch(
			() => cardCountFunction.value,
			() => {
				checked.value = cardCountFunction.value != null;
			}
		);

		const loadCollection = async (): Promise<CardCountFunction | null> => {
			if (!checked.value) {
				return null;
			}
			return ygoprodeckService.getCollectionCardCountFunction(
				ygoprodeckController.getCredentials()
			);
		};
		const reload = (): void => {
			Promise.resolve()
				.then(() => store.commit(SET_LOADING, { loading: true }))
				.then(() => loadCollection())
				.then((loadedCollectionCardCountFunction) => {
					cardCountFunction.value = loadedCollectionCardCountFunction;
				})
				.then(() => context.emit("change"))
				.catch((err) => {
					logger.error("Could not load user collection!", err);
					showError(
						context,
						"Could not load user collection!",
						"deck-tool__portal"
					);
				})
				.finally(() => store.commit(SET_LOADING, { loading: false }));
		};

		return { checked, reload };
	},
});
</script>

<style lang="scss">
@import "../../../browser-common/styles/variables";
@import "../../../browser-common/styles/mixins";

.deck-tool {
	.collection-filter {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}
</style>
