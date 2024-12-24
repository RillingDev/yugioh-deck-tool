<template>
	<ul class="d-flex price price--group">
		<li
			v-for="[vendor, lookupResult] in priceByVendor.entries()"
			:key="vendor.id"
			:class="`price__vendor--${vendor.id}`"
			:title="`${vendor.name} Price`"
			class="price__vendor"
		>
			<span>
				{{ vendor.name }}:
				{{ formatPrice(lookupResult, vendor) }}
			</span>
			<VDialog v-if="lookupResult.missing.length > 0" max-width="500">
				<template #activator="{ props: activatorProps }">
					<VBtn
						v-bind="activatorProps"
						icon="fas fa-exclamation"
						title="Some cards have no price data"
						size="x-small"
						color="warning"
						class="ms-2 price__vendor__missing"
					/>
				</template>
				<template #default="{ isActive }">
					<VCard
						title="Missing Prices"
						subtitle="Some cards have no price data"
					>
						<VCardText>
							<p>
								Missing prices for vendor {{ vendor.name }} for
								{{ lookupResult.missing.length }} card(s):
							</p>
							<ul class="ms-6">
								<li
									v-for="line in listMissingCards(
										lookupResult,
									)"
									:key="line"
								>
									{{ line }}
								</li>
							</ul>
						</VCardText>
						<VCardActions>
							<VBtn @click="isActive.value = false">
								Close Dialog
							</VBtn>
						</VCardActions>
					</VCard>
				</template>
			</VDialog>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { cardService, priceService } from "@/application/ctx";
import type { Card, PriceLookupResult, Vendor } from "@/core/lib";
import { DEFAULT_VENDOR_ARR } from "@/core/lib";
import { computed } from "vue";
import { VBtn } from "vuetify/components/VBtn";
import { VCard, VCardActions, VCardText } from "vuetify/components/VCard";
import { VDialog } from "vuetify/components/VDialog";

const props = defineProps<{ cards: readonly Card[] }>();

const priceByVendor = computed(
	() =>
		new Map(
			DEFAULT_VENDOR_ARR.map((vendor) => {
				const lookupResult = priceService.getPrice(props.cards, vendor);
				return [vendor, lookupResult];
			}),
		),
);

function listMissingCards(lookupResult: PriceLookupResult) {
	return cardService.createFormattedCardCountList(lookupResult.missing);
}

function formatPrice(lookupResult: PriceLookupResult, vendor: Vendor) {
	return priceService.formatPrice(lookupResult.price, vendor.currency);
}
</script>

<style lang="scss">
@use "../../browser-common/styles/component/price";

.deck-tool {
	.price {
		@include price.price();
	}
}
</style>
