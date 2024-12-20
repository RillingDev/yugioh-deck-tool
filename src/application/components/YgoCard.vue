<template>
	<a
		:data-name="card.name"
		:data-passcode="card.passcode"
		tabindex="0"
		class="ygo-card"
	>
		<img :alt="card.name" :src="imgSrc" />
	</a>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";
import type { Card } from "@/core/lib";
import { resourceService } from "@/application/ctx";

const props = defineProps({
	card: {
		required: true,
		type: Object as PropType<Card>,
	},
	scaleVertically: {
		required: false,
		type: Boolean as PropType<boolean>,
		default: false,
	},
});

const imgSrc = computed<string>(
	() =>
		props.card.image?.urlSmall ??
		resourceService.getPlaceholderCardImageUrl(),
);
</script>

<style lang="scss">
.ygo-card {
	display: block; // Make sure link covers full card

	img {
		width: 100%;
		height: auto;
		pointer-events: none; // Allow "clicking through" to parent link.
		vertical-align: middle;
	}
}
</style>
