<template>
    <ul class="price price--group">
        <li
            :class="`price__vendor--${vendor.id}`"
            :key="vendor.id"
            :title="`${vendor.name} Price`"
            class="price__vendor"
            v-for="([vendor, lookupResult], index) in priceByVendor.entries()"
        >
            <span>{{ vendor.name }}: {{ formatPrice(lookupResult) }}</span>
            <button
                ref="missingCardButtons"
                v-show="lookupResult.missing.length > 0"
                class="btn btn-sm btn-warning price__warning"
            >
                <span class="fas fa-exclamation" aria-hidden="true"></span>
                <span class="sr-only" aria-hidden="true"
                    >Some cards have no price data.</span
                >
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
import { computed, defineComponent, PropType, ref } from "@vue/composition-api";
import { appStore } from "../composition/appStore";
import { BTooltip } from "bootstrap-vue";

const priceService = applicationContainer.get<PriceService>(
    APPLICATION_TYPES.PriceService
);
const cardService = applicationContainer.get<CardService>(
    APPLICATION_TYPES.CardService
);
export default defineComponent({
    components: { BTooltip },
    props: {
        cards: {
            required: true,
            type: Array as PropType<Card[]>,
        },
    },
    setup(props, context) {
        const activeCurrency = computed<Currency>(
            () => appStore(context).state.currency.active
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
        const listMissingCards = (lookupResult: PriceLookupResult): string[] =>
            cardService.createFormattedCardCountList(
                cardService.countByCard(lookupResult.missing)
            );
        const formatPrice = (lookupResult: PriceLookupResult): string =>
            priceService.formatPrice(lookupResult.price, activeCurrency.value);

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
@import "../../../ui/src/styles/component/price";
@import "../../../ui/src/styles/variables";

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

    [data-screenshot-in-progress="true"] .price__warning {
        display: none;
    }
}
</style>
