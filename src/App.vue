<template>
    <div>
        <div class="main-form">
            <div class="form-app-wrapper form-group">
                <label class="form-app-label">Deck:</label>
                <div class="form-app-item">
                    <input class="form-control" id="formUploadDeck" type="file" title="Upload Deck" accept=".ydk" @change="fileOnUpload">
                    <input class="form-control deck-name" type="text" title="Deck Title" placeholder="Deck Title" v-model="deck.name" @input="deckUpdate()">
                </div>
                <a class="btn btn-primary form-control" title="Download Deck" download @click="deckToFile">Download</a>
            </div>
            <div class="form-app-wrapper form-group">
                <label class="form-app-label">Share:</label>
                <div class="form-app-item">
                    <input class="form-control" id="formLinkShare" type="url" title="Shareable Link" :value="shareLink">
                </div>
                <a class="btn btn-primary form-control" title="Copy Decklist to Clipboard" @click="copyShareText">Copy Decklist to Clipboard</a>
            </div>
            <div class="form-app-wrapper form-group">
                <label class="form-app-label">Price:</label>
                <div class="form-app-item">
                    <select class="form-control deck-currency" title="Price Currency" v-model="price.activeCurrency">
                        <option v-for="currency in price.currencies" :key="currency.id" :value="currency">{{currency.name}}</option>
                    </select>
                </div>
                <div class="btn btn-primary form-control" title="Load Prices" @click="fetchPrices">
                    <span :hidden="!ajax.pricesLoaded">Load Prices</span>
                    <span :hidden="ajax.pricesLoaded">
                        <i class="fa fa-circle-o-notch fa-spin fa-fw"></i>
                    </span>
                </div>
            </div>
        </div>
        <div class="main-deck">
            <h3>Decklist:</h3>
            <div class="deck" v-if="ajax.namesLoaded">
                <div class="deck-part deck-part-total" v-if="ajax.pricesLoaded">
                    <div class="deck-title">
                        <h4>Total:</h4>
                        <ygo-prices :price="price" :items="Object.values(deck.list)"></ygo-prices>
                    </div>
                </div>

                <div class="deck-part" v-for="deckpart in deckparts" :key="deckpart.id" :class="'deck-part-'+deckpart.id">
                    <div class="deck-title">
                        <h4>{{deckpart.name}} Deck ({{deck.list[deckpart.id].length}} Cards):</h4>
                        <ygo-prices :price="price" :items="deck.list[deckpart.id]"></ygo-prices>
                    </div>
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

/* @import "styles/main/general";
@import "styles/main/typo";
@import "styles/blocks/forms";
@import "styles/blocks/deck";
@import "styles/blocks/card";
@import "styles/blocks/price";
@import "styles/blocks/builder"; */
</style>
