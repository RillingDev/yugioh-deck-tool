<template>
	<section :class="`ygo-deck-part--${deckPart}`">
		<header class="d-flex justify-space-between mb-2">
			<div class="d-flex ga-3 align-center">
				<h2 class="text-h5">{{ deckPartConfig.name }} Deck</h2>
				<small>{{ deckPartStats }}</small>
			</div>
			<YgoPrice :cards="cards" />
		</header>
		<div
			ref="draggableEl"
			class="ygo-deck-part__content pa-2 ga-2"
			:data-deck-part-area="deckPart"
		>
			<!-- re-add possibility to remove via mouse -->
			<YgoCard
				v-for="(card, cardIndex) in cards"
				:key="`${cardIndex}_${card.passcode}`"
				:card="card"
			/>
		</div>
	</section>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import { computed, ref, toRaw } from "vue";
import type { Card, DeckPart, DeckPartConfig } from "@/core/lib";
import { DefaultDeckPartConfig } from "@/core/lib";
import YgoCard from "../YgoCard.vue";
import YgoPrice from "../YgoPrice.vue";
import { useDeckStore } from "@/application/store/deck";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";
import { deckController, deckService } from "@/application/ctx";
import { useCardDraggable } from "@/application/composition/dragging";

const props = defineProps({
	deckPart: {
		required: true,
		type: String as PropType<DeckPart>,
	},
});
const deckPartConfig = computed<DeckPartConfig>(
	() => DefaultDeckPartConfig[props.deckPart],
);

const deckStore = useDeckStore();

const { format } = storeToRefs(useFormatStore());

const cards = computed<Card[]>({
	get: () => deckStore.deck.parts[props.deckPart],
	set: (newCards) =>
		deckStore.replacePart({ deckPart: props.deckPart, newCards }),
});
const deckPartStats = computed(() => {
	const currentCards = cards.value;
	const base = `${currentCards.length} Cards`;
	if (currentCards.length === 0) {
		return base;
	}
	const details = deckController
		// The vue proxy breaks functionality here, so use the raw value
		.calculateDetailedTypeStats(props.deckPart, toRaw(currentCards))
		.map(([type, count]) => `${count} ${type}`);
	return `${base} (${details.join(" | ")})`;
});

const draggableEl = ref<HTMLElement | null>(null);
// TODO re-add possibility to remove via drag
useCardDraggable(
	draggableEl,
	cards,
	{
		pull: true,
		put: true,
	},
	(e) => {
		const areaMarker = e.to.dataset.deckPartArea;
		if (areaMarker == null) {
			return false;
		}
		const newDeckPart = areaMarker as DeckPart;
		const oldDeckPart = props.deckPart;

		return deckService.canMove(
			deckStore.deck,
			e.data,
			oldDeckPart,
			newDeckPart,
			format.value,
		);
	},
);
</script>
<style lang="scss">
@use "sass:color";
@use "sass:map";
@use "vuetify";
@use "../../../browser-common/styles/_variables.scss";
@use "../../../browser-common/styles/_mixins.scss";

.ygo-deck-part {
	&__content {
		min-height: 6rem; // Add a little space for cards to be dragged to

		border: 3px solid variables.$black;
		background-color: variables.$color-deck-part-side;

		display: grid;
		grid-template-columns: repeat(6, 1fr);

		@media (min-width: map.get(vuetify.$grid-breakpoints, "md")) {
			grid-template-columns: repeat(8, 1fr);
		}

		@media (min-width: map.get(vuetify.$grid-breakpoints, "lg")) {
			grid-template-columns: repeat(10, 1fr);
		}
	}

	&--main .ygo-deck-part__content {
		border-color: color.adjust(
			variables.$color-deck-part-main,
			$lightness: -13.25%
		);
		background-color: variables.$color-deck-part-main;
	}

	&--extra .ygo-deck-part__content {
		border-color: color.adjust(
			variables.$color-deck-part-extra,
			$lightness: -13.25%
		);
		background-color: variables.$color-deck-part-extra;
	}

	&--side .ygo-deck-part__content {
		border-color: color.adjust(
			variables.$color-deck-part-side,
			$lightness: -13.25%
		);
		background-color: variables.$color-deck-part-side;
	}
}
</style>
