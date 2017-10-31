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
                    <select class="form-control deck-currency" title="Price Currency" v-model="price.active">
                        <option v-for="currency in price.currencies" :key="currency.id" :value="currency.id">{{currency.name}}</option>
                    </select>
                </div>
                <div class="btn btn-primary form-control" title="Load Prices" @click="fetchNames">
                    <span :hidden="ajax.pricesLoaded">Load Prices</span>
                    <span :hidden="!ajax.pricesLoaded">
                        <i class="fa fa-circle-o-notch fa-spin fa-fw"></i>
                    </span>
                </div>
            </div>
        </div>
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

const urls = getUrls();

export default {
  name: "app",
  components: {},
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
  computed: {
    shareLink() {
      return location.origin + location.pathname + uriDeckEncode(this.deck);
    }
  },
  methods: {
    fetchNames() {
      const vm = this;

      apiLoadNames(urls)
        .then(result => {
          vm.cards.data = result.data;
          vm.cards.pairs = result.pairs;
          vm.ajax.namesLoaded = true;
        })
        .catch(console.error);
    },
    fetchPrices() {
      const vm = this;

      apiLoadNames(urls, vm.deck.list, vm.card.data)
        .then(result => {
          if (result !== false) {
            vm.cards.data = result;
          }
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
    deckToUri() {},
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
      this.deckLoadUri(urlQuery);
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
