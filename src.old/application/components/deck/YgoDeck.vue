<template>
	<div id="deckToolDeck" class="deck">
		<header class="deck__header">
			<h1 class="deck__total h4">Total</h1>
			<YgoPrice :cards="allCards" />
		</header>
		<hr />
		<YgoDeckPart
			v-for="deckPart in deckParts"
			:key="deckPart"
			:deck-part="deckPart"
			:drag-group="props.dragGroup"
		/>
	</div>
</template>

<script setup lang="ts">
import { DECK_PART_ARR } from "@/core/lib";
import type { PropType } from "vue";
import { computed } from "vue";
import YgoPrice from "../YgoPrice.vue";
import YgoDeckPart from "./YgoDeckPart.vue";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckService } from "@/application/ctx";

const props = defineProps({
	dragGroup: {
		required: true,
		type: String as PropType<string>,
	},
});
const deckParts = DECK_PART_ARR;

const { deck } = storeToRefs(useDeckStore());
const allCards = computed(() => deckService.getAllCards(deck.value));
</script>

<style lang="scss">
@import "../../../browser-common/styles/variables";
@import "../../../browser-common/styles/mixins";

.deck-tool {
	.deck {
		&__header {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			@include screen-min-width(lg) {
				align-items: center;
				flex-direction: row;
			}
		}

		&__total.h4 {
			margin-bottom: $margin-sm;
			@include screen-min-width(lg) {
				margin-bottom: 0;
			}
		}
	}
}

.deck-tool__screenshot-context .deck {
	padding: $margin-sm;
}
</style>
