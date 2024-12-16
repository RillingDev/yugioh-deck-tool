<template>
	<ul class="price price--group">
		<li
			v-for="[vendor, lookupResult] in priceByVendor.entries()"
			:key="vendor.id"
			:class="`price__vendor--${vendor.id}`"
			:title="`${vendor.name} Price`"
			class="price__vendor"
		>
			<span
				>{{ vendor.name }}:
				{{ formatPrice(lookupResult, vendor) }}</span
			>
			<VTooltip custom-class="deck-tool__portal">
				<template #activator="{ props }">
					<VBtn
						v-show="lookupResult.missing.length > 0"
						v-bind="props"
						icon="fas fa-exclamation"
						title="Some cards have no price data"
					/>
				</template>
				<span>
					Missing prices for
					{{ lookupResult.missing.length }} card(s):
				</span>
				<ul class="price__warning__missing">
					<li
						v-for="line in listMissingCards(lookupResult)"
						:key="line"
					>
						{{ line }}
					</li>
				</ul>
			</VTooltip>
		</li>
	</ul>
</template>

<script setup lang="ts">
import type { Card, PriceLookupResult, Vendor } from "@/core/lib";
import { DEFAULT_VENDOR_ARR } from "@/core/lib";
import type { PropType } from "vue";
import { computed, ref } from "vue";
import { VTooltip } from "vuetify/components/VTooltip";
import { VBtn } from "vuetify/components/VBtn";
import { cardService, priceService } from "@/application/ctx";

const props = defineProps({
	cards: {
		required: true,
		type: Array as PropType<Card[]>,
	},
});
const priceByVendor = computed<Map<Vendor, PriceLookupResult>>(
	() =>
		new Map(
			DEFAULT_VENDOR_ARR.map((vendor) => {
				const lookupResult = priceService.getPrice(props.cards, vendor);
				return [vendor, lookupResult];
			}),
		),
);
const listMissingCards = (lookupResult: PriceLookupResult): string[] =>
	cardService.createFormattedCardCountList(lookupResult.missing);
const formatPrice = (lookupResult: PriceLookupResult, vendor: Vendor): string =>
	priceService.formatPrice(lookupResult.price, vendor.currency);
</script>

<style lang="scss"></style>
