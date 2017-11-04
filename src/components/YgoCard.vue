<template>
    <a class="deck-card" target="_blank" v-if="hasData" :href="link" @contextmenu.prevent="deckCardRemove()">
        <div class="deck-card-image">
           <img width="100" height="144" :src="image">
        </div>
        <div class="deck-card-text">
            <div class="deck-card-name">{{cardName}}</div>
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
  props: ["cardId", "cardName", "deckCardRemove"],
  computed: {
    hasData() {
      return isDefined(this.cardName);
    },
    image() {
      return `${urls.imageAPI}/${this.cardId}.jpg`;
    },
    link() {
      return `${urls.buyAPI}${encodeURI(this.cardName.replace(/ /g, "+"))}`;
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
  line-height: 1.125em;
  font-size: 0.85em;
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
