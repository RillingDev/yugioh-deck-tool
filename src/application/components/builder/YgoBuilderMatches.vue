<template>
	<div class="builder_matches">
		<ol
			v-show="matches.length > 0"
			class="builder-matches__list"
			@scroll.passive="(e) => scrollHandler(e)"
		>
			<li
				v-for="card in limitedMatches"
				:key="card.passcode"
				class="builder-matches__match"
			>
				<template v-if="isTouchDevice">
					<YgoCard
						:card="card"
						:scale-vertically="true"
						class="builder-matches__match__card"
						@click.native.prevent="() => addCard(card)"
					></YgoCard>
				</template>
				<template v-else>
					<Draggable
						:group="{
							name: dragGroup,
							pull: 'clone',
							put: false,
						}"
						:value="[card]"
						:move="(e) => canMove(e)"
						:animation="0"
						@start="() => disableTooltip()"
						@end="() => enableTooltip()"
					>
						<YgoCard
							:card="card"
							:scale-vertically="true"
							class="builder-matches__match__card"
						></YgoCard>
					</Draggable>
				</template>

				<div class="builder-matches__match__details">
					<p>{{ card.name }}</p>
					<p>
						<small>{{ getTypeText(card) }}</small>
					</p>
					<p>
						<small>{{ getSubTypeText(card) }}</small>
					</p>
					<p>
						<small v-show="getCardCount(card) != null"
							>{{ getCardCount(card) }} in Collection</small
						>
					</p>
				</div>
			</li>
		</ol>
		<div v-show="matches.length === 0" class="builder-matches__no-matches">
			No matches found.
		</div>
	</div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";
import { browserSupportsTouch } from "@/browser-common/lib";
import type { Card } from "@/core/lib";
import { CardTypeCategory } from "@/core/lib";
import Draggable from "vuedraggable";
import type { DraggableMoveValidatorData } from "../../composition/dragging";
import {
	findCardForDraggableValidatorData,
	findDeckPartForDraggableValidatorData,
} from "../../composition/dragging";
import { showSuccess, useToast } from "../../composition/feedback";
import { useInfiniteScrolling } from "../../composition/infiniteScrolling";
import { useTooltip } from "../../composition/tooltip";
import YgoCard from "../YgoCard.vue";
import { useDeckStore } from "@/application/store/deck";
import { useCollectionStore } from "@/application/store/collection";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";
import { deckService } from "@/application/container";

export default defineComponent({
	components: {
		YgoCard,
		Draggable,
	},
	props: {
		matches: {
			required: true,
			type: Array as PropType<Card[]>,
		},
		dragGroup: {
			required: true,
			type: String as PropType<string>,
		},
	},
	emits: [],
	setup(props) {
		const deckStore = useDeckStore();

		const { cardCountFunction } = storeToRefs(useCollectionStore());

		const { format } = storeToRefs(useFormatStore());

		const toast = useToast();

		const { limitedArr: limitedMatches, scrollHandler } =
			useInfiniteScrolling(
				computed(() => props.matches),
				50,
				25
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

		const isTouchDevice = computed(browserSupportsTouch);

		const addCard = (card: Card): void => {
			const deckPart = deckService.findAvailableDeckPart(
				deckStore.deck,
				card,
				format.value
			);
			if (deckPart != null) {
				deckStore.addCard({ card, deckPart });
				showSuccess(
					toast,
					"Successfully added card to deck.",
					"deck-tool__portal"
				);
			}
		};

		const canMove = (e: DraggableMoveValidatorData): boolean => {
			const card = findCardForDraggableValidatorData(e);
			const newDeckPart = findDeckPartForDraggableValidatorData(e);
			if (newDeckPart == null) {
				return false;
			}
			return deckService.canAdd(
				deckStore.deck,
				card,
				newDeckPart,
				format.value
			);
		};

		const { disableTooltip, enableTooltip } = useTooltip();

		return {
			limitedMatches,
			getTypeText,
			getSubTypeText,
			getCardCount,
			canMove,
			addCard,

			isTouchDevice,

			enableTooltip,
			disableTooltip,

			scrollHandler,
		};
	},
});
</script>

<style lang="scss">
@import "../../../browser-common/styles/variables";
@import "../../../browser-common/styles/mixins";

.deck-tool {
	.builder-matches {
		&__no-matches {
			margin-top: $margin-md;
			margin-bottom: $margin-md;
			text-align: center;
			color: $gray-600;
		}

		&__list {
			overflow-y: scroll;
			max-height: 50rem;
			margin: 0;
			padding: 0;
			list-style: none;
			border: 1px solid $gray-400;
		}

		&__match {
			display: flex;
			padding: 0.35rem;
			border-bottom: 1px solid $gray-400;

			&__card {
				height: 5rem;
			}

			&__details {
				padding-left: $margin-md;

				> p {
					margin-bottom: 0;
				}
			}
		}
	}
}
</style>
