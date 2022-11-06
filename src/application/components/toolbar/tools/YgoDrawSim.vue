<template>
	<BDropdownItemButton v-b-modal.drawSim :disabled="!hasMainDeckCards">
		<span
			class="fas fa-hand-sparkles fas-in-button"
			aria-hidden="true"
		></span>
		Simulate Start-Hand
		<BModal
			id="drawSim"
			hide-footer
			modal-class="deck-tool__portal"
			body-class="draw-sim__modal"
			size="lg"
			title="Start-Hand Simulation"
			@show="() => draw()"
		>
			<div class="btn-group" role="group">
				<button
					:class="{ active: goingFirst }"
					class="btn btn-primary"
					@click="() => setGoingFirst(true)"
				>
					Going First
				</button>
				<button
					:class="{ active: !goingFirst }"
					class="btn btn-primary"
					@click="() => setGoingFirst(false)"
				>
					Going Second
				</button>
			</div>
			<div class="draw-sim__output">
				<YgoCard
					v-for="(card, index) of drawnCards"
					:key="`${index}_${card.passcode}`"
					class="draw-sim__output__card"
					:card="card"
				/>
			</div>
			<button class="btn btn-primary" @click="() => draw()">Draw</button>
		</BModal>
	</BDropdownItemButton>
</template>

<script lang="ts">
import YgoCard from "../../YgoCard.vue";
import type { Card } from "@/core/lib";
import { DeckPart } from "@/core/lib";
import { BDropdownItemButton, BModal } from "bootstrap-vue";
import { computed, defineComponent, ref } from "vue";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckService } from "@/application/container";

export default defineComponent({
	components: {
		YgoCard,
		BModal,
		BDropdownItemButton,
	},
	props: {},
	emits: [],
	setup() {
		const { deck } = storeToRefs(useDeckStore());

		const goingFirst = ref<boolean>(true);
		const drawnCards = ref<Card[]>([]);

		const hasMainDeckCards = computed<boolean>(
			() => deck.value.parts[DeckPart.MAIN].length > 0
		);

		const draw = (): void => {
			drawnCards.value = deckService.getSimulatedStartingHand(
				deck.value,
				goingFirst.value
			);
		};
		const setGoingFirst = (val: boolean): void => {
			goingFirst.value = val;
			draw();
		};

		return {
			goingFirst,
			hasMainDeckCards,
			drawnCards,
			setGoingFirst,
			draw,
		};
	},
});
</script>

<style lang="scss">
@import "../../../../browser-common/styles/variables";
@import "../../../../browser-common/styles/mixins";

.deck-tool__portal {
	.draw-sim__modal {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.draw-sim__output {
		display: flex;
		padding: 0.35rem;
		margin: 0.35rem 0;
		flex-wrap: wrap;
		justify-content: center;

		&__card {
			max-width: 33.333%;
			@include screen-min-width(md) {
				max-width: 20%;
			}
			@include screen-min-width(lg) {
				max-width: 15%;
			}
			padding: 0.35rem;
		}
	}
}
</style>
