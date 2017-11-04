<template>
    <div class="deck-price" v-if="priceData.size>0">
        <span class="deck-price-item pricemode" v-for="priceMode in priceModes" :key="priceMode.id" :class="'pricemode-'+priceMode.id">
            {{isgroup ? priceForItems(priceMode) : priceForItem(priceMode)}}
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
  props: ["item", "isGroup", "priceData", "priceActiveCurrency"],
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

</style>
