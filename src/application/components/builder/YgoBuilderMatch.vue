<template>
	<div class="ygo-builder-match d-flex ga-2 pa-2">
		<div ref="draggableEl" class="flex-shrink-0">
			<YgoCard :card="card" />
		</div>

		<div>
			<p>{{ card.name }}</p>
			<p>
				<small>{{ typeText }}</small>
			</p>
			<p>
				<small>{{ subTypeText }}</small>
			</p>
			<p v-if="cardCount != null">
				<small>{{ cardCount }} in Collection</small>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed, ref, shallowRef } from "vue";
import type { Card, DeckPart } from "@/core/lib";
import { CardTypeCategory } from "@/core/lib";
import YgoCard from "../YgoCard.vue";
import { useDeckStore } from "@/application/store/deck";
import { useCollectionStore } from "@/application/store/collection";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";
import { deckService } from "@/application/ctx";
import { useCardDraggable } from "@/application/composition/dragging";

const props = defineProps({
	card: {
		required: true,
		type: Object as PropType<Card>,
	},
});

const deckStore = useDeckStore();
const { format } = storeToRefs(useFormatStore());
const { cardCountFunction } = storeToRefs(useCollectionStore());

const typeText = computed(() =>
	props.card.type.category === CardTypeCategory.MONSTER
		? props.card.type.name
		: props.card.type.category,
);
const subTypeText = computed(() =>
	props.card.type.category === CardTypeCategory.MONSTER
		? `${props.card.attribute!}/${props.card.subType}`
		: props.card.subType,
);
const cardCount = computed(() => cardCountFunction.value?.(props.card) ?? null);

const draggableEl = ref<HTMLElement | null>(null);
const cards = shallowRef([props.card]);
useCardDraggable(
	draggableEl,
	cards,
	{
		pull: "clone",
		put: false,
	},
	(e) => {
		const areaMarker = e.to.dataset.deckPartArea;
		if (areaMarker == null) {
			return false;
		}
		const newDeckPart = areaMarker as DeckPart;
		return deckService.canAdd(
			deckStore.deck,
			e.data,
			newDeckPart,
			format.value,
		);
	},
);
</script>

<style lang="scss">
.ygo-builder-match {
	.ygo-card {
		width: 3.75rem;
	}
}
</style>
