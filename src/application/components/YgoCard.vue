<template>
	<a :data-name="card.name" tabindex="0">
		<img :alt="card.name" :src="imgSrc" :width="width" />
	</a>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";
import type { Card } from "@/core/lib";
import { resourceService } from "@/application/ctx";

type Size = "small" | "medium";

const props = defineProps({
	card: {
		required: true,
		type: Object as PropType<Card>,
	},
	size: {
		required: false,
		default: "small",
		type: String as PropType<Size>,
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

const width = computed(() => (props.size === "medium" ? 150 : 100));
</script>

<style lang="scss"></style>
