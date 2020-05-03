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
            {{ priceController.format(price) }}
        </span>
    </div>
</template>

<script lang="ts">
import { applicationContainer } from "@/inversify.config";
import { PriceController } from "@/lib/controller/PriceController";
import { UI_TYPES } from "@/types";
import { Card, Vendor } from "yugioh-deck-tool-core/src/main";
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component({})
export default class YgoPriceView extends Vue {
    @Prop({ required: true })
    cards: Card[];
    @Prop({ required: false, default: () => false })
    group: boolean;

    priceController = applicationContainer.get<PriceController>(
        UI_TYPES.PriceController
    );

    get priceByVendor(): Map<Vendor, number> {
        return this.priceController.getPriceByVendor(this.cards);
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
