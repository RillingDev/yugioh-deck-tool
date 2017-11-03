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
            <!--<div class="deck-price deck-price--sm" v-if="ajax.pricesLoaded">
                <span class="deck-price-item pricemode" v-for="mode in price.modes" :key="mode.id" :class="'pricemode-'+mode.id">{{priceForCard(cardId,mode.id)}}</span>
            </div>-->
        </div>
    </a>
</template>

<script>
import { forEachEntry } from "lightdash";
import getUrls from "../lib/data/urls";

const urls = getUrls();

export default {
  props: ["cardid", "carddata"],
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
