<template>
	<section
		:class="[
			`deck-part--${deckPart}`,
			{ 'deck-part--empty': deckPartEmpty },
		]"
		class="deck-part"
	>
		<header class="deck-part__header">
			<div class="deck-part__details">
				<h2 class="deck-part__name h5">
					{{ deckPartConfig.name }} Deck
				</h2>
				<small class="deck-part__stats">{{ deckPartStats }}</small>
			</div>
			<YgoPrice :cards="cards" />
		</header>
		<!-- Spill is set to 'revert', actual removal is done in custom draggable variant -->
		<!-- <Draggable
			class="deck-part__content"
			tag="div"
			:value="cards"
			:move="canMove"
			:revert-on-spill="true"
			:animation="0"
			:data-deck-part-area="deckPart"
			@change="onChange"
			@start="() => disableTooltip()"
			@end="() => enableTooltip()"
		> -->
		<YgoCard
			v-for="(card, cardIndex) in cards"
			:key="`${cardIndex}_${card.passcode}`"
			:card="card"
		>
		</YgoCard>
		<!-- </Draggable> -->
	</section>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";
import type { Card, DeckPart, DeckPartConfig } from "@/core/lib";
import { DefaultDeckPartConfig, getLogger } from "@/core/lib";
import type {
	DraggableChangeEventData,
	DraggableMoveValidatorData,
} from "../../composition/dragging";
import {
	findCardForDraggableValidatorData,
	findDeckPartForDraggableValidatorData,
} from "../../composition/dragging";
import { useTooltip } from "../../composition/tooltip";
import YgoCard from "../YgoCard.vue";
import YgoPrice from "../YgoPrice.vue";
import { useDeckStore } from "@/application/store/deck";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";
import { deckController, deckService } from "@/application/ctx";

const logger = getLogger("YgoDeckPart");

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

const cards = computed<Card[]>(() => deckStore.deck.parts[props.deckPart]);
const deckPartEmpty = computed<boolean>(() => cards.value.length === 0);
const deckPartStats = computed<string>(() => {
	const currentCards = cards.value;
	const base = `${currentCards.length} Cards`;
	if (currentCards.length === 0) {
		return base;
	}
	const details = deckController
		.calculateDetailedTypeStats(props.deckPart, currentCards)
		.map(([type, count]) => `${count} ${type}`);
	return `${base} (${details.join(" | ")})`;
});

const addCard = (card: Card, newIndex: number): void =>
	deckStore.addCard({
		deckPart: props.deckPart,
		card,
		newIndex,
	});
const removeCard = (card: Card, oldIndex: number): void =>
	deckStore.removeCard({
		deckPart: props.deckPart,
		card,
		oldIndex,
	});
const reorderCard = (card: Card, oldIndex: number, newIndex: number): void =>
	deckStore.reorderCard({
		deckPart: props.deckPart,
		card,
		oldIndex,
		newIndex,
	});
const onChange = (e: DraggableChangeEventData): void => {
	if (e.removed != null) {
		removeCard(e.removed.element, e.removed.oldIndex);
	} else if (e.added != null) {
		addCard(e.added.element, e.added.newIndex);
	} else if (e.moved != null) {
		reorderCard(e.moved.element, e.moved.oldIndex, e.moved.newIndex);
	} else {
		logger.warn("Unexpected drag event type.", e);
	}
};
const canMove = (e: DraggableMoveValidatorData): boolean => {
	const card = findCardForDraggableValidatorData(e);
	const newDeckPart = findDeckPartForDraggableValidatorData(e);
	if (newDeckPart == null) {
		return false;
	}
	const oldDeckPart = props.deckPart;

	return deckService.canMove(
		deckStore.deck,
		card,
		oldDeckPart,
		newDeckPart,
		format.value,
	);
};

const { disableTooltip, enableTooltip } = useTooltip();
</script>
<style lang="scss"></style>
