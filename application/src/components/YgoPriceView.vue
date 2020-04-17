<template>
    <div :class="{ 'price--group': group }" class="price">
        <span
            :class="'price-mode-' + vendor.id"
            :key="vendor.id"
            :title="`${vendor.name} Price`"
            class="price-mode"
            v-for="[vendor, price] in priceByVendor.entries()"
        >
            <span v-if="group">{{ vendor.name }}: </span>
            {{ priceController.format(price) }}
        </span>
    </div>
</template>

<script lang="ts">
import { uiContainer } from "@/inversify.config";
import { PriceController } from "@/lib/controller/PriceController";
import { UI_TYPES } from "@/types";
import { Card, Vendor } from "../../../core/src/main";
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component({})
export default class YgoPriceView extends Vue {
    @Prop({ required: true })
    cards: Card[];
    @Prop({ required: false, default: () => false })
    group: boolean;

    priceController = uiContainer.get<PriceController>(
        UI_TYPES.PriceController
    );

    get priceByVendor(): Map<Vendor, number> {
        return this.priceController.getPriceByVendor(this.cards);
    }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../styles/variables.custom";

.price {
    &.price--group {
        margin-bottom: 0.5rem;
    }

    &:not(.price--group) {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}

.price-mode {
    font-size: 0.9em;
    display: inline-block;
    padding: 5px 8px 2px;
    text-align: center;

    &-tcgplayer {
        color: #fff;
        background-color: $color-pricemode-tcgplayer;
    }

    &-cardmarket {
        background-color: $color-pricemode-cardmarket;
    }

    &-coolstuffinc {
        color: #fff;
        background-color: $color-pricemode-coolstuffinc;
    }
}
</style>
