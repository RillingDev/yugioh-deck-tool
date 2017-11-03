<template>
    <div class="deck-price" >
        <span class="deck-price-item pricemode" v-for="pricemode in price.modes" :key="pricemode.id" :class="'pricemode-'+pricemode.id">
            {{priceForSection(pricemode)}}
        </span>
    </div>
</template>

<script>
import { forEachEntry } from "lightdash";
import formatPrice from "../lib/formatPrice";

export default {
  props: ["items", "price"],
  data: () => {
    return {};
  },
  methods: {
    priceForSection(pricemode) {
      /*       const val = this.items.reduce(
        (a, b) => a.price[pricemode.id] + b.price[pricemode.id]
      ); */
      console.log(this.items);

      return formatPrice(123, this.price.activeCurrency);
    }
  }
};
</script>

<style lang="scss">

</style>
