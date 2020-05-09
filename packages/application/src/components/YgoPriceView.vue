<template>
    <div :class="{ 'price--group': group }" class="price">
        <span
            :class="'price__vendor--' + vendor.id"
            :key="vendor.id"
            :title="`${vendor.name} Price`"
            class="price__vendor"
            v-for="[vendor, price] in priceByVendor.entries()"
        >
            <span v-if="group">{{ vendor.name }}: </span>
            {{ formatPrice(price) }}
        </span>
    </div>
</template>

<script lang="ts">
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";
import {
    Card,
    DEFAULT_VENDOR_ARR,
    PriceService,
    Vendor,
} from "yugioh-deck-tool-core/src/main";
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

const priceService = applicationContainer.get<PriceService>(
    APPLICATION_TYPES.PriceService
);
@Component({})
export default class YgoPriceView extends Vue {
    @Prop({ required: true })
    cards: Card[];
    @Prop({ required: false, default: () => false })
    group: boolean;

    get priceByVendor(): Map<Vendor, number> {
        return new Map(
            DEFAULT_VENDOR_ARR.map((vendor) => {
                const lookupResult = priceService.getPrice(
                    this.cards,
                    vendor,
                    this.getCurrency()
                );
                return [vendor, lookupResult.price];
            })
        );
    }

    formatPrice(price: number) {
        return priceService.formatPrice(price, this.getCurrency());
    }

    private getCurrency() {
        return this.$store.state.currency.active;
    }
}
</script>

<style lang="scss">
@import "../styles/variables.custom";
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "~yugioh-deck-tool-ui/src/styles/component/price";

.price {
    @include price();
}
</style>
