<template>
	<ul class="price price--group">
		<li
			v-for="([vendor, lookupResult], index) in priceByVendor.entries()"
			:key="vendor.id"
			:class="`price__vendor--${vendor.id}`"
			:title="`${vendor.name} Price`"
			class="price__vendor"
		>
			<span
				>{{ vendor.name }}:
				{{ formatPrice(lookupResult, vendor) }}</span
			>
			<button
				v-show="lookupResult.missing.length > 0"
				ref="missingCardButtons"
				title="Some cards have no price data"
				class="btn btn-sm btn-warning price__warning"
			>
				<span class="fas fa-exclamation" aria-hidden="true"></span>
			</button>
			<BTooltip
				custom-class="deck-tool__portal"
				:target="() => missingCardButtons[index]"
			>
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
			</BTooltip>
		</li>
	</ul>
</template>

<script lang="ts">
import type { Card, PriceLookupResult, Vendor } from "@/core/lib";
import { DEFAULT_VENDOR_ARR } from "@/core/lib";
import type { PropType } from "vue";
import { computed, defineComponent, ref } from "vue";
import { BTooltip } from "bootstrap-vue";
import { cardService, priceService } from "@/tooltip/container";

export default defineComponent({
	components: { BTooltip },
	props: {
		cards: {
			required: true,
			type: Array as PropType<Card[]>,
		},
	},
	emits: [],
	setup(props) {
		const priceByVendor = computed<Map<Vendor, PriceLookupResult>>(
			() =>
				new Map(
					DEFAULT_VENDOR_ARR.map((vendor) => {
						const lookupResult = priceService.getPrice(
							props.cards,
							vendor
						);
						return [vendor, lookupResult];
					})
				)
		);
		const listMissingCards = (lookupResult: PriceLookupResult): string[] =>
			cardService.createFormattedCardCountList(lookupResult.missing);
		const formatPrice = (
			lookupResult: PriceLookupResult,
			vendor: Vendor
		): string =>
			priceService.formatPrice(lookupResult.price, vendor.currency);

		const missingCardButtons = ref<HTMLElement[]>([]);

		return {
			missingCardButtons,
			priceByVendor,
			formatPrice,
			listMissingCards,
		};
	},
});
</script>

<style lang="scss">
@import "../../browser-common/styles/component/price";
@import "../../browser-common/styles/variables";

.deck-tool,
.deck-tool__portal {
	.price {
		@include price();

		&__warning.btn.btn-warning {
			padding: 0;
			font-size: 0.85em;
			height: 18px;
			width: 18px;
			margin-left: 0.35rem;
		}

		&__warning__missing {
			padding-left: 0.75rem;
			margin: 0;
		}
	}
}

.deck-tool__screenshot-context {
	.price {
		&__warning.btn.btn-warning {
			display: none;
		}
	}
}
</style>
