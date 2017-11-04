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
            <div class="deck-card-name">{{cardname}}</div>
            <ygo-prices :price="price" :items="cardid"></ygo-prices>
        </div>
    </a>
</template>

<script>
import getUrls from "../lib/data/urls";
import { isDefined } from "lightdash";

import YgoPrices from "./YgoPrices.vue";

const urls = getUrls();

export default {
  components: {
    YgoPrices
  },
  props: ["cardid", "cardname", "price"],
  computed: {
    hasData() {
      return isDefined(this.cardname);
    },
    image() {
      return `${urls.imageAPI}/${this.cardid}.jpg`;
    },
    link() {
      return `${urls.buyAPI}${encodeURI(this.cardname.replace(/ /g, "+"))}`;
    }
  }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "../styles/variables";

.deck-card {
  position: relative;
  margin: 5px;
}

.deck-card-text {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: $gray-100;
  opacity: 0;
  transition: opacity 0.15s;
  text-align: center;
  color: $gray-700;
  word-wrap: break-word;
  line-height: 1.25em;
  font-size: 0.9em;
  &:focus,
  &:hover {
    opacity: 1;
  }
}

/* .deck-card-price {
  p {
    margin-bottom: 0;
    padding-top: 4px;
    padding-bottom: 4px;
  }
} */
</style>
