<template>
	<VDialog
		max-width="900"
		class="ygo-draw-sim"
		@after-enter="simulateStartHand"
	>
		<template #activator="{ props: activatorProps }">
			<VBtn
				v-bind="activatorProps"
				:disabled="!hasMainDeckCards"
				prepend-icon="fas fa-magic"
				color="primary"
				variant="outlined"
			>
				Simulate
			</VBtn>
		</template>

		<template #default="{ isActive }">
			<VCard
				title="Simulate Start Hand"
				subtitle="Simulate how your start hand may look like"
			>
				<VCardText>
					<div class="d-flex justify-end mb-3">
						<VBtnGroup>
							<VBtn
								:active="goingFirst"
								@click="() => setGoingFirst(true)"
							>
								Going First
							</VBtn>
							<VBtn
								:active="!goingFirst"
								@click="() => setGoingFirst(false)"
							>
								Going Second
							</VBtn>
						</VBtnGroup>
					</div>
					<div class="d-flex justify-center ga-2 mb-3">
						<YgoCard
							v-for="(card, index) of drawnCards"
							:key="`${index}_${card.passcode}`"
							:card="card"
						/>
					</div>
					<div class="d-flex justify-center">
						<VBtn color="primary" @click="simulateStartHand">
							Draw a New Hand
						</VBtn>
					</div>
				</VCardText>
				<VCardActions>
					<VBtn @click="isActive.value = false">Close Dialog</VBtn>
				</VCardActions>
			</VCard>
		</template>
	</VDialog>
</template>

<script setup lang="ts">
import YgoCard from "../YgoCard.vue";
import type { Card } from "@/core/lib";
import { DeckPart } from "@/core/lib";
import { VBtn } from "vuetify/components/VBtn";
import { VBtnGroup } from "vuetify/components/VBtnGroup";
import { VDialog } from "vuetify/components/VDialog";
import { VCard, VCardActions, VCardText } from "vuetify/components/VCard";
import { computed, ref, shallowRef } from "vue";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckService } from "@/application/ctx";

const { deck } = storeToRefs(useDeckStore());

const goingFirst = ref(true);
const drawnCards = shallowRef<Card[]>([]);

const hasMainDeckCards = computed(
	() => deck.value.parts[DeckPart.MAIN].length > 0,
);

function simulateStartHand() {
	drawnCards.value = deckService.getSimulatedStartingHand(
		deck.value,
		goingFirst.value,
	);
}
function setGoingFirst(val: boolean) {
	goingFirst.value = val;
	simulateStartHand();
}
</script>

<style lang="scss">
.ygo-draw-sim {
	.ygo-card {
		flex-basis: 7rem;
	}
}
</style>
