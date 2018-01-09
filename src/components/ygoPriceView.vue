<template>
    <div
        class="price"
        :class="{'price--group' : isGroup}"
        v-if="priceDb.prices.size>0"
    >
        <span
            class="price-mode"
            v-for="(priceMode, index) in priceDb.modes"
            :key="priceMode.id"
            :class="'price-mode-'+priceMode.id"
        >
            {{ priceDb.format(priceValues[index]) }}
        </span>
    </div>
</template>

<script>
import { isString } from "lightdash";
import PriceDatabase from "../lib/classes/priceDatabase";

export default {
    props: {
        item: {
            type: [String, Array],
            required: true
        },
        priceDb: {
            type: PriceDatabase,
            required: true
        }
    },
    computed: {
        isGroup() {
            return !isString(this.item);
        },
        priceValues() {
            return this.isGroup
                ? this.priceDb.getSelection(this.item)
                : this.priceDb.get(this.item);
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/mixins";
@import "node_modules/bootstrap/scss/variables";

@import "../styles/variables.custom";

.price {
    &.price--group {
        margin-bottom: 0.5rem;
    }
    &:not(.price--group) {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
    }
}

.price-mode {
    padding: 2px 4px;
    display: inline-block;
    &-low {
        background-color: $color-pricemode-low;
    }
    &-average {
        background-color: $color-pricemode-average;
    }
    &-high {
        background-color: $color-pricemode-high;
    }
}
</style>
