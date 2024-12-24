<template>
	<a :data-name="card.name" tabindex="0" class="ygo-card">
		<img :alt="card.name" :src="imgSrc" />
	</a>
</template>

<script setup lang="ts">
import { resourceService } from "@/application/ctx";
import type { Card } from "@/core/lib";
import { computed } from "vue";

// TODO: add slots for buttons, and possibly rework link to card database to go there

const props = defineProps<{ card: Card }>();

const imgSrc = computed(
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
