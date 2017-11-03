<template>
    <div class="app">

        <!-- app-forms -->
        <div class="app-section app-forms">
            <!-- app-forms-upload -->
            <div class="form-group">
                <label>Deck:</label>
                <input class="form-control" type="file" accept=".ydk" @change="fileOnUpload" title="Upload Deck">
                <input class="form-control form-deck-name" type="text" v-model="deck.name" @input="deckUpdate()" title="Deck Title" placeholder="Deck Title" >
                <button class="btn btn-primary form-control" download @click="deckToFile" title="Download Deck">Download</button>
            </div>
             <!-- app-forms-share -->
            <div class="form-group">
                <label>Share:</label>
                <input class="form-control" type="url" :value="shareLink" title="Shareable Link">
                <button class="btn btn-primary form-control" @click="copyShareText" title="Copy Decklist to Clipboard">Copy Decklist to Clipboard</button>
            </div>
             <!-- app-forms-price -->
            <div class="form-group">
                <label>Price:</label>
                <select class="form-control form-deck-currency" v-model="price.activeCurrency" title="Price Currency">
                    <option v-for="currency in price.currencies" :key="currency.id" :value="currency">{{currency.name}}</option>
                </select>
                <button class="btn btn-primary form-control" @click="fetchPrices" title="Load Prices">
                    <span :hidden="!ajax.pricesLoaded">Load Prices</span>
                    <span :hidden="ajax.pricesLoaded">
                        <i class="fa fa-circle-o-notch fa-spin fa-fw"></i>
                    </span>
                </button>
            </div>
        </div>

         <!-- app-deck -->
        <div class="app-section app-deck">
            <h2>Decklist:</h2>
            <div class="deck" v-if="ajax.namesLoaded">
                <div class="deck-part deck-part-total" v-if="ajax.pricesLoaded">
                    <h3>Total:</h3>
                    <ygo-prices :price="price" :items="Object.values(deck.list)"></ygo-prices>
                </div>
                <div class="deck-part" v-for="deckpart in deckparts" :key="deckpart.id" :class="'deck-part-'+deckpart.id">
                    <h3>{{deckpart.name}} Deck ({{deck.list[deckpart.id].length}} Cards):</h3>
                    <ygo-prices :price="price" :items="deck.list[deckpart.id]"></ygo-prices>
                    <div class="deck-content" v-if="deck.list[deckpart.id].length">
                        <ygo-card
                            v-for="(cardId, index) in deck.list[deckpart.id]"
                            :key="`${cardId}_${index}`"
                            :cardid="cardId"
                            :carddata="cards.data"
                            :price="price"
                        ></ygo-card>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import FileSaver from "file-saver/FileSaver";
import clipboard from "clipboard-js/clipboard";
import apiLoadNames from "./lib/apiLoadNames";
import apiLoadPrices from "./lib/apiLoadPrices";
import uriDeckDecode from "./lib/uriDeckDecode";
import uriDeckEncode from "./lib/uriDeckEncode";
import convertFileToDeck from "./lib/convertFileToDeck";
import convertDeckToFile from "./lib/convertDeckToFile";
import convertDeckToText from "./lib/convertDeckToText";

import deckparts from "./lib/data/deckparts";
import priceCurrencies from "./lib/data/priceCurrencies";
import priceModes from "./lib/data/priceModes";
import getUrls from "./lib/data/urls";

import YgoPrices from "./components/YgoPrices.vue";
import YgoCard from "./components/YgoCard.vue";

const urls = getUrls();

export default {
  name: "app",
  components: { YgoPrices, YgoCard },
  data: () => {
    return {
      cards: {
        pairs: [],
        data: new Map()
      },
      deckparts,
      price: {
        activeCurrency: priceCurrencies[0],
        currencies: priceCurrencies,
        modes: priceModes,
        data: new Map()
      },
      ajax: {
        namesLoaded: false,
        pricesLoaded: true
      },
      deck: {
        name: "Unnamed",
        list: {
          main: [],
          extra: [],
          side: []
        }
      }
    };
  },
  computed: {
    shareLink() {
      return location.origin + location.pathname + this.deckToUri();
    }
  },
  methods: {
    fetchNames() {
      const vm = this;

      vm.ajax.namesLoaded = false;

      apiLoadNames(urls)
        .then(result => {
          vm.cards.data = result.data;
          vm.cards.pairs = result.pairs;
          vm.ajax.namesLoaded = true;

          console.log("LOADED NAMES", vm.cards.data);
        })
        .catch(console.error);
    },
    fetchPrices() {
      const vm = this;

      vm.ajax.pricesLoaded = false;

      apiLoadPrices(urls, vm.deck.list, vm.cards.data, vm.price.data)
        .then(result => {
          if (result !== false) {
            vm.price.data = result;
          }

          console.log("LOADED PRICES", vm.price.data);

          vm.ajax.pricesLoaded = true;
        })
        .catch(console.error);
    },
    fileOnUpload(e) {
      const files = e.target.files || e.dataTransfer.files;

      this.deckFromFile(files[0]);
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
    deckFromUri(uriDeck) {
      const deckArray = uriDeckDecode(this.deckparts, uriDeck);

      this.deck.name = deckArray[0];
      this.deck.list = deckArray[1];
    },
    deckToFile() {
      const fileData = convertDeckToFile(this.deckparts, this.deck.list);
      const file = new File([fileData], `${this.deck.name}.ydk`, {
        type: "text/ydk"
      });

      return FileSaver.saveAs(file);
    },
    deckToUri() {
      return uriDeckEncode(this.deck);
    },
    deckToText() {
      return convertDeckToText(this.deckparts, this.cards, this.deck);
    },
    copyShareText() {
      clipboard.copy({
        "text/plain": this.deckToText()
      });
    }
  },
  mounted() {
    const urlQuery = location.search;

    this.fetchNames();

    if (urlQuery.includes("?d")) {
      this.deckFromUri(urlQuery);
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

@import "styles/blocks/general";
@import "styles/blocks/app";
@import "styles/blocks/forms";
@import "styles/blocks/deck";
</style>
