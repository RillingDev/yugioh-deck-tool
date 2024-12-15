<template>
	<a :data-name="card.name" class="card" tabindex="0">
		<img
			:alt="card.name"
			:class="{ 'card__img--vertically-scaling': scaleVertically }"
			:src="imgSrc"
			class="card__img"
		/>
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

<style lang="scss"></style>
