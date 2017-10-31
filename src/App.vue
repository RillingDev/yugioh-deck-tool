<template>
    <div>
       <ygo-forms
            :deckparts="deckparts"
            :cards="cards"
            :deck="deck"
            :ajax="ajax"
            :price="price"

            :deckFromFile="deckFromFile"
            :apiLoadPrices="apiLoadPrices"
        ></ygo-forms>
         <!--<ygo-deck
            :deckparts="deckparts"
            :cards="cards"
            :deck="deck"
            :ajax="ajax"
            :price="price"
        ></ygo-deck>
        <ygo-builder
            :deckparts="deckparts"
            :cards="cards"
            :deck="deck"
            :ajax="ajax"
            :builder="builder"
        ></ygo-builder>-->
    </div>
</template>

<script>
import { forEachEntry } from "lightdash";
import getCardsWithoutPriceData from "./lib/getCardsWithoutPriceData";
import uriDeckDecode from "./lib/uriDeckDecode";
import convertFileToDeck from "./lib/convertFileToDeck";

import deckparts from "./lib/data/deckparts";
import priceCurrencies from "./lib/data/priceCurrencies";
import priceModes from "./lib/data/priceModes";
import getUrls from "./lib/data/urls";

import YgoForms from "./components/YgoForms.vue";
/* import YgoDeck from "./components/YgoDeck.vue";
import YgoBuilder from "./components/YgoBuilder.vue";
 */
export default {
  name: "app",
  components: {
    YgoForms
    /*   YgoDeck,
    YgoBuilder */
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
    apiLoadNames() {
      const vm = this;
      const urls = getUrls();

      vm.ajax.namesLoaded = false;

      fetch(urls.nameAPI)
        .then(response => response.json())
        .then(json => {
          const resultData = {};
          const resultPairs = [];
          const nameStorage = [];

          forEachEntry(json, (name, id) => {
            resultData[id] = {
              name,
              img: `${urls.imageAPI}/${id}.jpg`,
              link: `${urls.buyAPI}${encodeURI(name)}`,
              price: null
            };

            // Only add each card once to parts, skip alternate arts
            if (name.length > 0 && nameStorage.indexOf(name) === -1) {
              resultPairs.push([id, name]);
            }

            nameStorage.push(name);
          });

          vm.cards.data = resultData;
          vm.cards.pairs = resultPairs.sort((a, b) => a[1].localeCompare(b[1]));

          vm.ajax.namesLoaded = true;
        })
        .catch(console.error);
    },
    apiLoadPrices() {
      const vm = this;
      const urls = getUrls();
      const cardIds = getCardsWithoutPriceData(vm.deck.list, vm.cards.data);

      if (cardIds.length > 0) {
        const cardNames = cardIds.map(cardId => vm.cards.data[cardId].name);
        const priceQuery = btoa(JSON.stringify(cardNames));

        vm.ajax.pricesLoaded = false;

        fetch(urls.priceAPI + priceQuery)
          .then(response => response.json())
          .then(json => {
            cardIds
              .forEach((id, index) => {
                const priceData = json[index];
                const card = vm.cards.data[id];

                if (card) {
                  card.price = {
                    low: priceData.low,
                    average: priceData.average,
                    high: priceData.high
                  };
                }
              })
              .catch(console.error);

            vm.ajax.pricesLoaded = true;
          });
      } else {
        vm.ajax.pricesLoaded = true;
      }
    },
    deckFromFile(file) {
      const vm = this;
      const reader = new FileReader();

      reader.onload = e => {
        vm.deck.name = file.name.replace(".ydk", "");
        vm.deck.list = convertFileToDeck(vm.deckparts, e.target.result);
      };

      reader.readAsText(file);
    },
    deckFromUri() {
      const vm = this;
      const deckArray = uriDeckDecode(vm.deckparts, uriDeck);

      vm.deck.name = deckArray[0];
      vm.deck.list = deckArray[1];
    },
    deckToFile() {},
    deckToUri() {},
    deckToText() {}
  },
  mounted() {
    const vm = this;
    const urlQuery = location.search;

    vm.apiLoadNames();

    if (urlQuery.includes("?d")) {
      vm.deckLoadUri(urlQuery);
    }
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
