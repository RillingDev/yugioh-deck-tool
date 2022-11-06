<template>
	<BDropdownGroup>
		<BDropdownItemButton
			:disabled="!essentialDataLoaded"
			@click="() => randomize()"
		>
			<span class="fas fa-magic fas-in-button" aria-hidden="true"></span>
			Randomize
		</BDropdownItemButton>
		<BDropdownItemButton
			v-b-modal.randomizerSettings
			:disabled="!essentialDataLoaded"
		>
			<span class="fas fa-cogs fas-in-button" aria-hidden="true"></span>
			Randomizer Settings
			<BModal
				id="randomizerSettings"
				hide-footer
				modal-class="deck-tool__portal"
				title="Randomizer Settings"
			>
				<div class="form-group">
					<VSelect
						v-model="strategy"
						:options="strategies"
						:clearable="false"
					>
						<template #header>
							<label>Randomization Strategy</label>
						</template>
					</VSelect>
				</div>
				<YgoFilter v-model="filter" :show-only="['sets']" />
			</BModal>
		</BDropdownItemButton>
	</BDropdownGroup>
</template>

<script lang="ts">
import type { CardFilter } from "@/core/lib";
import { RandomizationStrategy } from "@/core/lib";
import { BDropdownGroup, BDropdownItemButton, BModal } from "bootstrap-vue";
import { defineComponent, readonly, ref } from "vue";
import YgoFilter from "../../YgoFilter.vue";
import VSelect from "vue-select";
import { useDataStore } from "@/application/store/data";
import { useFormatStore } from "@/application/store/format";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckRandomizationService } from "@/application/container";

export default defineComponent({
	components: {
		YgoFilter,
		VSelect,
		BModal,
		BDropdownItemButton,
		BDropdownGroup,
	},
	props: {},
	emits: [],
	setup() {
		const deckStore = useDeckStore();

		const strategies = readonly<RandomizationStrategy[]>(
			Object.values(RandomizationStrategy)
		);

		const strategy = ref<RandomizationStrategy>(
			RandomizationStrategy.ARCHETYPE_2
		);
		const filter = ref<CardFilter>({
			sets: [],
		});

		const { format } = storeToRefs(useFormatStore());

		const randomize = (): void => {
			const randomizedDeck = deckRandomizationService.randomize(
				strategy.value,
				{
					filter: {
						...filter.value,
						format: format.value,
					},
				}
			);
			deckStore.replace({ deck: randomizedDeck });
		};

		const { essentialDataLoaded } = storeToRefs(useDataStore());

		return {
			strategy,
			strategies,
			filter,

			essentialDataLoaded,

			randomize,
		};
	},
});
</script>

<style lang="scss">
@import "../../../../browser-common/styles/variables";

.deck-tool__portal {
	.randomizer__btn-group {
		justify-content: space-between;
	}
}
</style>
