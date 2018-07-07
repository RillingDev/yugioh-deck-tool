<template>
    <div
        v-if="priceDb.prices.size>0"
        :class="{'price--group' : isGroup}"
        class="price"
    >
        <span
            v-for="(priceMode, index) in priceDb.modes"
            :key="priceMode.id"
            :title="`${priceMode.name} Price`"
            :class="'price-mode-'+priceMode.id"
            class="price-mode"
        >
            {{ priceDb.format(priceValues[index]) }}
        </span>
    </div>
</template>

<script>
import { isString } from "lightdash";
import PriceDb from "../lib/priceDb/priceDb";

export default {
    props: {
        item: {
            type: [String, Array],
            required: true
        },
        priceDb: {
            type: PriceDb,
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
        justify-content: space-between;
        flex-direction: column;
    }
}

.price-mode {
    padding: 5px 8px 2px;
    font-size: 0.9em;
    display: inline-block;
    text-align: center;
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
