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
                    :title="`Missing ${lookupResult.missing.length} card(s)`"
                    aria-hidden="true"
                    class="price__warning fas fa-exclamation"
                ></span>
                <span class="sr-only">
                    Missing {{ lookupResult.missing.length }} card(s)
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
    Currency,
    DEFAULT_VENDOR_ARR,
    PriceLookupResult,
    PriceService,
    Vendor,
} from "yugioh-deck-tool-core/src/main";
import { PropType } from "vue";
import { computed, defineComponent } from "@vue/composition-api";

const priceService = applicationContainer.get<PriceService>(
    APPLICATION_TYPES.PriceService
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
        const formatPrice = (lookupResult: PriceLookupResult) =>
            priceService.formatPrice(lookupResult.price, activeCurrency.value);

        return { priceByVendor, formatPrice };
    },
});
</script>

<style lang="scss" scoped>
@import "~yugioh-deck-tool-ui/src/styles/component/price";

.price {
    @include price();
}
</style>
