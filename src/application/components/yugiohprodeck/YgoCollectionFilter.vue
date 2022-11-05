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
import type { CardCountFunction } from "@/core/lib";
import { getLogger } from "@/core/lib";
import { computed, defineComponent, ref, watch } from "vue";
import { applicationContainer } from "../../inversify.config";
import { BFormCheckbox } from "bootstrap-vue";
import { showError, useToast } from "../../composition/feedback";
import { APPLICATION_TYPES } from "../../types";
import type { YgoprodeckController } from "../../controller/YgoprodeckController";
import type { YgoprodeckService } from "@/ygoprodeck/lib";
import { YGOPRODECK_TYPES } from "@/ygoprodeck/lib";
import { useCollectionStore } from "@/application/store/collection";
import { useDataStore } from "@/application/store/data";
import { storeToRefs } from "pinia";

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
		const collectionStore = useCollectionStore();
		const { loading } = storeToRefs(useDataStore());

		const toast = useToast();

		const cardCountFunction = computed({
			get: () => collectionStore.cardCountFunction,
			set: (newCardCountFunction) =>
				collectionStore.setCardCountFunction({
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
				.then(() => (loading.value = true))
				.then(() => loadCollection())
				.then((loadedCollectionCardCountFunction) => {
					cardCountFunction.value = loadedCollectionCardCountFunction;
				})
				.then(() => context.emit("change"))
				.catch((err) => {
					logger.error("Could not load user collection!", err);
					showError(
						toast,
						"Could not load user collection!",
						"deck-tool__portal"
					);
				})
				.finally(() => (loading.value = false));
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
