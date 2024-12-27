<template>
	<div :data-name="card.name" tabindex="0" class="ygo-card position-relative">
		<img :alt="card.name" :src="imgSrc" />
		<VSpeedDial location="bottom center">
			<template #activator="{ props: activatorProps }">
				<VBtn
					v-bind="activatorProps"
					icon="fas fa-ellipsis-v"
					aria-label="More"
					size="x-small"
					width="22"
					height="22"
					class="ygo-card__btn position-absolute top-0 right-0"
				>
				</VBtn>
			</template>
			<VBtn
				key="show-details"
				prepend-icon="fas fa-external-link-alt"
				:href="referenceLink"
				target="_blank"
				rel="noopener"
			>
				Show Details
			</VBtn>
			<slot name="buttons"></slot>
		</VSpeedDial>
	</div>
</template>

<script setup lang="ts">
import { resourceService } from "@/application/ctx";
import type { Card } from "@/core/lib";
import { getReferenceLink } from "@/tooltip/tooltip/bindReferenceLink";
import { computed } from "vue";
import { VBtn } from "vuetify/components/VBtn";
import { VList, VListItem, VListItemTitle } from "vuetify/components/VList";
import { VMenu } from "vuetify/components/VMenu";
import { VSpeedDial } from "vuetify/components/VSpeedDial";

// TODO: add slots for buttons, and possibly rework link to card database to go there

const props = defineProps<{ card: Card }>();

const imgSrc = computed(
	() =>
		props.card.image?.urlSmall ??
		resourceService.getPlaceholderCardImageUrl(),
);
const referenceLink = computed(() => getReferenceLink(props.card).toString());
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

	&__btn {
		visibility: hidden;
	}
	&:hover,
	&:focus,
	&:focus-within {
		.ygo-card__btn {
			visibility: initial;
		}
	}
}
</style>
