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
			:drag-group="dragGroup"
		/>
	</div>
</template>
<script lang="ts">
import type { DeckPart } from "@/core/lib";
import { DECK_PART_ARR } from "@/core/lib";
import type { PropType } from "vue";
import { computed, defineComponent, readonly } from "vue";
import YgoPrice from "../YgoPrice.vue";
import YgoDeckPart from "./YgoDeckPart.vue";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckService } from "@/application/container";

export default defineComponent({
	components: {
		YgoDeckPart,
		YgoPrice,
	},
	props: {
		dragGroup: {
			required: true,
			type: String as PropType<string>,
		},
	},
	emits: [],
	setup() {
		const deckParts = readonly<DeckPart[]>(DECK_PART_ARR);

		const { deck } = storeToRefs(useDeckStore());
		const allCards = computed(() => deckService.getAllCards(deck.value));

		return {
			deckParts,
			allCards,
		};
	},
});
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
