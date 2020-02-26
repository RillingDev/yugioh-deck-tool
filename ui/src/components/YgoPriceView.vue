<template>
    <div :class="{ 'price--group': isGroup }" class="price">
        <span
            :class="'price-mode-' + priceMode.id"
            :key="priceMode.id"
            :title="`${priceMode.name} Price`"
            class="price-mode"
            v-for="(priceMode, index) in priceDb.modes"
        >
            <span v-if="isGroup">{{ priceMode.name }}: </span>
            {{ priceDb.format(priceValues[index]) }}
        </span>
    </div>
</template>

<script lang="ts">
import { isString } from "lodash";
import PriceDb from "../lib/priceDb/PriceDatabase";

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

    &-ebay {
        background-color: $color-pricemode-ebay;
    }
}
</style>
