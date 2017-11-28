<template>
    <div
        class="price"
        :class="{'price--group' : isGroup}"
        v-if="priceData.size>0"
      >
        <span
          class="price-mode"
          v-for="priceMode in priceModes"
          :key="priceMode.id"
          :class="'price-mode-'+priceMode.id"
        >
            {{ isGroup ? priceForItems(priceMode) : priceForItem(priceMode) }}
        </span>
    </div>
</template>

<script>
import {
  arrFlattenDeep,
  arrCompact,
  isArray,
  objValues,
  isDefined
} from "lightdash";
import priceModes from "../lib/data/priceModes";

export default {
  props: {
    item: {},
    priceData: {
      type: Map,
      required: true,
      default: () => new Map()
    },
    priceActiveCurrency: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: "null",
          name: "null",
          label: "null",
          val: 1
        };
      }
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  data: () => {
    return {
      priceModes
    };
  },
  methods: {
    priceForItem(priceMode) {
      const val = this.getPriceOfMode(priceMode, this.item);

      return this.formatPrice(val);
    },
    priceForItems(priceMode) {
      const items = isArray(this.item)
        ? this.item
        : arrFlattenDeep(objValues(this.item));

      if (items.length > 0) {
        const val = items
          .map(cardId => this.getPriceOfMode(priceMode, cardId))
          .reduce((a, b) => a + b);

        return this.formatPrice(val);
      } else {
        return this.formatPrice(0);
      }
    },
    getPriceOfMode(priceMode, cardId) {
      if (this.priceData.has(cardId)) {
        const val = this.priceData.get(cardId)[priceMode.id];

        return isDefined(val) ? val : 0;
      } else {
        return 0;
      }
    },
    formatPrice(val) {
      const currency = this.priceActiveCurrency;

      return (val * currency.val).toFixed(2) + currency.label;
    }
  }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "../styles/variables";
@import "../styles/variables.app";

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
