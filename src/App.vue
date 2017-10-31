<template>
    <div>
        <ygo-forms deckparts="deckparts" :deck="deck" :ajax="ajax" :price="price">></ygo-forms>
        <ygo-deck deckparts="deckparts" :cards="cards" :deck="deck" :ajax="ajax" :price="price"></ygo-deck>
        <ygo-builder deckparts="deckparts" :cards="cards" :deck="deck" :ajax="ajax" :builder="builder"></ygo-builder>
    </div>
</template>

<script>
import deckparts from "./lib/data/deckparts";
import priceCurrencies from "./lib/data/priceCurrencies";
import priceModes from "./lib/data/priceModes";

import apiLoadNames from "./lib/apiLoadNames";
//import apiLoadPrices from "./lib/apiLoadPrices";
import deckLoadUri from "./lib/deckLoadUri";
//import deckUpdate from "./lib/deckUpdate";
//import deckCardsWithoutPriceData from "./lib/deckCardsWithoutPriceData";
import YgoForms from "./components/YgoForms.vue";
import YgoDeck from "./components/YgoDeck.vue";
import YgoBuilder from "./components/YgoBuilder.vue";

export default {
  name: "app",
  components: {
    YgoForms,
    YgoDeck,
    YgoBuilder
  },
  data: () => {
    return {
      cards: {
        pairs: [],
        data: {}
      },
      deckparts,
      price: {
        active: "dollar_us",
        currencies: priceCurrencies,
        modes: priceModes
      },
      ajax: {
        namesLoaded: false,
        pricesLoaded: false
      },
      deck: {
        name: "Unnamed",
        link: "",
        list: {
          main: [],
          extra: [],
          side: []
        }
      },
      builder: {
        filter: "",
        pairsFiltered: []
      }
    };
  },
  methods: {
    //uriLocationNoParam,

    apiLoadNames,
    //apiLoadPrices,

    //deckLoad,
    deckLoadUri,
    //deckUpdate,
    // deckCardsWithoutPriceData

    /*     priceConvert,
    priceForCard,
    priceForSection,

    builderUpdateNames,
    builderDeckAdd,
    builderDeckRemove,

    fileDownloadDeck,
    fileOnUpload,

    shareText */
    deckUpdate() {
      console.log("update called");
    }
  },
  mounted() {
    const urlQuery = location.search;

    this.apiLoadNames();

    if (urlQuery.includes("?d")) {
      this.deckLoadUri(urlQuery);
    }
    console.log(this);
  }
};
</script>

<style lang="scss">
$color-deckpart-main: #907057;
$color-deckpart-extra: #935293;
$color-deckpart-side: #54925a;
$color-pricemode-low: #ddffc9;
$color-pricemode-average: #fff8b7;
$color-pricemode-high: #ffdad0;

@import "node_modules/bootstrap/scss/functions";
@import "styles/variables";
@import "styles/bootstrap";

/* @import "styles/main/general";
@import "styles/main/typo";
@import "styles/blocks/forms";
@import "styles/blocks/deck";
@import "styles/blocks/card";
@import "styles/blocks/price";
@import "styles/blocks/builder"; */
</style>
