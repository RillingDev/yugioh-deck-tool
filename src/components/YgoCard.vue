<template>
    <a class="deck-card" target="_blank" :href="link" :data-name="cardName" @contextmenu.prevent="onRightClick()">
        <div class="deck-card-image">
           <img width="100" height="140" :src="image">
        </div>
        <div class="deck-card-text">
            <div class="deck-card-name">{{cardName || `[${cardId}]`}}</div>
            <slot class="deck-card-price" name="price"></slot>
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
  props: ["cardId", "cardName", "onRightClick"],
  computed: {
    hasData() {
      return isDefined(this.cardName);
    },
    image() {
      return this.hasData
        ? `${urls.imageAPI}/${this.cardId}.jpg`
        : "./unknown.png";
    },
    link() {
      return this.hasData
        ? `${urls.buyAPI}${encodeURI(this.cardName.replace(/ /g, "+"))}`
        : `http://yugioh.wikia.com/wiki/${this.cardId}`;
    }
  }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "../styles/variables";
@import "../styles/variables.app";

.deck-card {
  position: relative;
  margin: 5px;
}

.deck-card-image img {
  height: 140px;
  width: 100px;
  margin-bottom: 0;
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
  background-color: $gray-200;
  opacity: 0;
  transition: opacity 0.15s;
  text-align: center;
  color: $gray-800;
  word-wrap: break-word;
  line-height: 1.125em;
  font-size: 0.85em;
  &:focus,
  &:hover {
    opacity: 1;
  }
}
</style>
