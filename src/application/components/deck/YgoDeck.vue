<template>
	<div id="deckToolDeck">
		<header class="d-flex justify-space-between mb-2">
			<h2 class="text-h5">Total</h2>
			<YgoPrice :cards="allCards" />
		</header>
		<hr />
		<YgoDeckPart
			v-for="deckPart in deckParts"
			:key="deckPart"
			:deck-part="deckPart"
			class="mb-6"
		/>
	</div>
</template>

<script setup lang="ts">
import { DECK_PART_ARR } from "@/core/lib";
import { computed } from "vue";
import YgoPrice from "../YgoPrice.vue";
import YgoDeckPart from "./YgoDeckPart.vue";
import { useDeckStore } from "@/application/store/deck";
import { storeToRefs } from "pinia";
import { deckService } from "@/application/ctx";

const deckParts = DECK_PART_ARR;

const { deck } = storeToRefs(useDeckStore());
const allCards = computed(() => deckService.getAllCards(deck.value));
</script>

<style lang="scss"></style>
