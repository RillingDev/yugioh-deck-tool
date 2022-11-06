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

<script lang="ts">
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";
import type { Card } from "@/core/lib";
import { resourceService } from "@/application/container";

export default defineComponent({
	components: {},
	props: {
		card: {
			required: true,
			type: Object as PropType<Card>,
		},
		scaleVertically: {
			required: false,
			type: Boolean as PropType<boolean>,
			default: false,
		},
	},
	emits: [],
	setup(props) {
		const imgSrc = computed<string>(
			() =>
				props.card.image?.urlSmall ??
				resourceService.getPlaceholderCardImageUrl()
		);

		return { imgSrc };
	},
});
</script>

<style lang="scss">
@import "../../browser-common/styles/variables";

.deck-tool,
.deck-tool__portal {
	.card {
		display: block; // Make sure link covers full card
		&:focus {
			outline: 4px solid $black;
		}
	}

	.card__img {
		width: 100%;
		height: auto;
		pointer-events: none; // Allow "clicking through" to parent link.

		&--vertically-scaling {
			width: auto;
			height: 100%;
		}
	}
}
</style>
