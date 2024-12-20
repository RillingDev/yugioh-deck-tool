<template>
	<div class="ygo-builder-matches">
		<VInfiniteScroll
			:item="limitedMatches"
			side="end"
			height="50rem"
			class="ygo-builder-matches__list"
			@load="load"
		>
			<template v-for="card in limitedMatches" :key="card.passcode">
				<li class="ygo-builder-matches__match d-flex ga-2 pa-2">
					<!--  re-add draggable -->
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
				</li></template
			>
		</VInfiniteScroll>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed, ref } from "vue";
import { browserSupportsTouch } from "@/browser-common/lib";
import type { Card, DeckPart } from "@/core/lib";
import { CardTypeCategory } from "@/core/lib";
import { showSuccess, useToast } from "../../composition/feedback";
import { useTooltip } from "../../composition/tooltip";
import YgoCard from "../YgoCard.vue";
import { useDeckStore } from "@/application/store/deck";
import { useCollectionStore } from "@/application/store/collection";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";
import { deckService } from "@/application/ctx";
import { useCardDraggable } from "@/application/composition/dragging";
import { VInfiniteScroll } from "vuetify/components/VInfiniteScroll";

const props = defineProps({
	matches: {
		required: true,
		type: Array as PropType<readonly Card[]>,
	},
});

const { cardCountFunction } = storeToRefs(useCollectionStore());

const limitedMatches = ref(props.matches.slice(0, 50));
const load: VInfiniteScroll["onLoad"] = async function ({ done }) {
	const nextChunkStart = limitedMatches.value.length;
	const nextChunk = props.matches.slice(nextChunkStart, nextChunkStart + 25);
	if (nextChunk.length === 0) {
		done("empty");
	} else {
		limitedMatches.value.push(...nextChunk);
		done("ok");
	}
};

function getTypeText(card: Card): string {
	return card.type.category === CardTypeCategory.MONSTER
		? card.type.name
		: card.type.category;
}
function getSubTypeText(card: Card): string {
	return card.type.category === CardTypeCategory.MONSTER
		? `${card.attribute!}/${card.subType}`
		: card.subType;
}
function getCardCount(card: Card): number | null {
	return cardCountFunction.value?.(card) ?? null;
}
</script>

<style lang="scss">
@use "../../../browser-common/styles/variables";

.ygo-builder-matches {
	.ygo-card {
		width: 4rem;
	}

	&__list {
		border: 1px solid variables.$gray-400;
	}

	&__match {
		border-bottom: 1px solid variables.$gray-400;
	}

	&__empty {
		text-align: center;
		color: variables.$gray-600;
	}
}
</style>
