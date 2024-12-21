<template>
	<VInfiniteScroll
		:item="limitedMatches"
		side="end"
		height="50rem"
		class="ygo-builder-matches"
		@load="load"
	>
		<YgoBuilderMatch
			v-for="card in limitedMatches"
			:key="card.passcode"
			:card="card"
			class="ygo-builder-matches__match"
		/>
	</VInfiniteScroll>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { shallowRef } from "vue";
import type { Card } from "@/core/lib";
import YgoBuilderMatch from "./YgoBuilderMatch.vue";
import { VInfiniteScroll } from "vuetify/components/VInfiniteScroll";

const props = defineProps({
	matches: {
		required: true,
		type: Array as PropType<readonly Card[]>,
	},
});

const limitedMatches = shallowRef(props.matches.slice(0, 50));
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
</script>

<style lang="scss">
@use "../../../browser-common/styles/variables";

.ygo-builder-matches {
	border: 1px solid variables.$gray-400;

	&__match {
		border-bottom: 1px solid variables.$gray-400;
	}
}
</style>
