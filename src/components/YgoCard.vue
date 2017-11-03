<template>
    <a
    class="deck-card"
    target="_blank"
    v-if="hasData"
    :href="link">
        <div class="deck-card-image">
           <img width="100" height="144" :src="image">
        </div>
        <div class="deck-card-text">
            <div class="deck-card-name">{{name}}</div>
            <ygo-prices :price="price" :items="cardid"></ygo-prices>
        </div>
    </a>
</template>

<script>
import getUrls from "../lib/data/urls";
import YgoPrices from "./YgoPrices.vue";

const urls = getUrls();

export default {
  components: {
    YgoPrices
  },
  props: ["cardid", "carddata", "price"],
  computed: {
    hasData() {
      return this.carddata.has(this.cardid);
    },
    name() {
      return this.carddata.get(this.cardid);
    },
    image() {
      return `${urls.imageAPI}/${this.cardid}.jpg`;
    },
    link() {
      return `${urls.buyAPI}${encodeURI(this.name)}`;
    }
  }
};
</script>

<style lang="scss">

</style>
