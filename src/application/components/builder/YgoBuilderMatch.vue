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
import { useCardDraggable } from "@/application/composition/dragging";
import { deckService } from "@/application/ctx";
import { useCollectionStore } from "@/application/store/collection";
import { useDeckStore } from "@/application/store/deck";
import { useFormatStore } from "@/application/store/format";
import type { Card, DeckPart } from "@/core/lib";
import { CardTypeCategory } from "@/core/lib";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import YgoCard from "../YgoCard.vue";

const props = defineProps<{ card: Card }>();

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
const cards = computed(() => [props.card]);
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
