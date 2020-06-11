<template>
    <ul class="price price--group">
        <li
            :class="`price__vendor--${vendor.id}`"
            :key="vendor.id"
            :title="`${vendor.name} Price`"
            class="price__vendor"
            v-for="[vendor, lookupResult] in priceByVendor.entries()"
        >
            <span>{{ vendor.name }}: {{ formatPrice(lookupResult) }}</span>
            <template v-if="lookupResult.missing.length > 0">
                <span
                    :title="listMissingCards(lookupResult)"
                    aria-hidden="true"
                    class="price__warning fas fa-exclamation"
                ></span>
                <span class="sr-only">
                    {{ listMissingCards(lookupResult) }}
                </span>
            </template>
        </li>
    </ul>
</template>

<script lang="ts">
import { applicationContainer } from "../inversify.config";
import { APPLICATION_TYPES } from "../types";
import {
    Card,
    CardService,
    Currency,
    DEFAULT_VENDOR_ARR,
    PriceLookupResult,
    PriceService,
    Vendor,
} from "../../../core/src/main";
import { computed, defineComponent, PropType } from "@vue/composition-api";

const priceService = applicationContainer.get<PriceService>(
    APPLICATION_TYPES.PriceService
);
const cardService = applicationContainer.get<CardService>(
    APPLICATION_TYPES.CardService
);
export default defineComponent({
    props: {
        cards: {
            required: true,
            type: Array as PropType<Card[]>,
        },
    },
    setup(props, context) {
        const activeCurrency = computed<Currency>(
            () => context.root.$store.state.currency.active
        );

        const priceByVendor = computed<Map<Vendor, PriceLookupResult>>(
            () =>
                new Map(
                    DEFAULT_VENDOR_ARR.map((vendor) => {
                        const lookupResult = priceService.getPrice(
                            props.cards,
                            vendor,
                            activeCurrency.value
                        );
                        return [vendor, lookupResult];
                    })
                )
        );
        const listMissingCards = (lookupResult: PriceLookupResult): string => {
            const cardList = cardService
                .createCountedCardList(lookupResult.missing)
                .join("\n");
            return `Missing prices for ${lookupResult.missing.length} card(s):\n\n${cardList}`;
        };
        const formatPrice = (lookupResult: PriceLookupResult): string =>
            priceService.formatPrice(lookupResult.price, activeCurrency.value);

        return { priceByVendor, formatPrice, listMissingCards };
    },
});
</script>

<style lang="scss">
@import "../../../ui/src/styles/component/price";

.deck-tool,
.deck-tool__modal {
    .price {
        @include price();
    }
}
</style>
