<template>
	<div class="ygo-builder-matches">
		<ol
			v-show="matches.length > 0"
			class="ygo-builder-matches__list"
			@scroll.passive="(e) => scrollHandler(e)"
		>
			<li
				v-for="card in limitedMatches"
				:key="card.passcode"
				class="ygo-builder-matches__match d-flex ga-2 pa-2"
			>
				<!-- re-add draggable -->
				<YgoCard :card="card" class="flex-shrink-0" />

				<div>
					<p>{{ card.name }}</p>
					<p>
						<small>{{ getTypeText(card) }}</small>
					</p>
					<p>
						<small>{{ getSubTypeText(card) }}</small>
					</p>
					<p>
						<small v-show="getCardCount(card) != null">
							{{ getCardCount(card) }} in Collection
						</small>
					</p>
				</div>
			</li>
		</ol>
		<div v-show="matches.length === 0" class="ygo-builder-matches__empty">
			No matching cards found.
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed, ref } from "vue";
import { browserSupportsTouch } from "@/browser-common/lib";
import type { Card, DeckPart } from "@/core/lib";
import { CardTypeCategory } from "@/core/lib";
import { showSuccess, useToast } from "../../composition/feedback";
import { useInfiniteScrolling } from "../../composition/infiniteScrolling";
import { useTooltip } from "../../composition/tooltip";
import YgoCard from "../YgoCard.vue";
import { useDeckStore } from "@/application/store/deck";
import { useCollectionStore } from "@/application/store/collection";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";
import { deckService } from "@/application/ctx";
import { useCardDraggable } from "@/application/composition/dragging";

const props = defineProps({
	matches: {
		required: true,
		type: Array as PropType<Card[]>,
	},
});

const { cardCountFunction } = storeToRefs(useCollectionStore());

// TODO replace
const { limitedArr: limitedMatches, scrollHandler } = useInfiniteScrolling(
	computed(() => props.matches),
	50,
	25,
);

const getTypeText = (card: Card): string =>
	card.type.category === CardTypeCategory.MONSTER
		? card.type.name
		: card.type.category;
const getSubTypeText = (card: Card): string =>
	card.type.category === CardTypeCategory.MONSTER
		? `${card.attribute!}/${card.subType}`
		: card.subType;
const getCardCount = (card: Card): number | null =>
	cardCountFunction.value?.(card) ?? null;
</script>

<style lang="scss">
@import "../../../browser-common/styles/variables";
@import "../../../browser-common/styles/mixins";

.ygo-builder-matches {
	.ygo-card {
		width: 4rem;
	}

	&__list {
		overflow-y: scroll;
		max-height: 50rem;
		border: 1px solid $gray-400;
	}

	&__match {
		border-bottom: 1px solid $gray-400;
	}

	&__empty {
		text-align: center;
		color: $gray-600;
	}
}
</style>
