<template>
    <div class="deck-price" v-if="price.data.size>0">
        <span class="deck-price-item pricemode" v-for="pricemode in price.modes" :key="pricemode.id" :class="'pricemode-'+pricemode.id">
            {{priceForSection(pricemode)}}
        </span>
    </div>
</template>

<script>
import { arrFlattenDeep, arrCompact, isArray } from "lightdash";
import formatPrice from "../lib/formatPrice";
import getPriceOfMode from "../lib/getPriceOfMode";

export default {
  props: ["items", "price"],
  data: () => {
    return {};
  },
  methods: {
    priceForSection(priceMode) {
      if (isArray(this.items)) {
        const listPrices = arrFlattenDeep(this.items).map(cardId =>
          getPriceOfMode(this.price.data, priceMode, cardId)
        );

        return formatPrice(
          listPrices.length > 0 ? listPrices.reduce((a, b) => a + b) : 0,
          this.price.activeCurrency
        );
      } else {
        return formatPrice(
          getPriceOfMode(this.price.data, priceMode, this.items),
          this.price.activeCurrency
        );
      }
    }
  }
};
</script>

<style lang="scss">

</style>
