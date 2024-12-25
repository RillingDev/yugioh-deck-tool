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
						<VBtnToggle
							v-model="startingHandMode"
							mandatory
							@update:model-value="simulateStartHand"
						>
							<VBtn value="goingFirst">Going First</VBtn>
							<VBtn value="goingSecond">Going Second</VBtn>
						</VBtnToggle>
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
import { deckService } from "@/application/ctx";
import { useDeckStore } from "@/application/store/deck";
import type { Card } from "@/core/lib";
import { DeckPart } from "@/core/lib";
import { storeToRefs } from "pinia";
import { computed, ref, shallowRef } from "vue";
import { VBtn } from "vuetify/components/VBtn";
import { VBtnToggle } from "vuetify/components/VBtnToggle";
import { VCard, VCardActions, VCardText } from "vuetify/components/VCard";
import { VDialog } from "vuetify/components/VDialog";
import YgoCard from "../YgoCard.vue";

const { deck } = storeToRefs(useDeckStore());

const startingHandMode = ref<"goingFirst" | "goingSecond">("goingFirst");
const drawnCards = shallowRef<Card[]>([]);

const hasMainDeckCards = computed(
	() => deck.value.parts[DeckPart.MAIN].length > 0,
);

function simulateStartHand() {
	drawnCards.value = deckService.getSimulatedStartingHand(
		deck.value,
		startingHandMode.value === "goingFirst",
	);
}
</script>

<style lang="scss">
.ygo-draw-sim {
	.ygo-card {
		flex-basis: 7rem;
	}
}
</style>
