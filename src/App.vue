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
                    <span :hidden="ajax.currentlyLoading">Load Prices</span>
                    <span :hidden="!ajax.currentlyLoading">
                        <i class="fa fa-circle-o-notch fa-spin fa-fw"></i>
                    </span>
                </button>
            </div>
        </div>
         <!-- app-deck -->
        <div class="app-section app-deck">
            <h2>Decklist:</h2>
            <div class="deck">
                <div class="deck-part deck-part-total" v-if="ajax.pricesLoaded">
                    <span>Total:</span>
                    <ygo-prices
                        :item="deck.list"
                        :is-group="true"
                        :price-data="price.data"
                        :price-active-currency="price.activeCurrency"
                    ></ygo-prices>
                </div>
                <div class="deck-part" v-for="deckPart in deck.parts" :key="deckPart.id" :class="'deck-part-'+deckPart.id">
                    <span>{{deckPart.name}} Deck ({{deck.list[deckPart.id].length}} Cards):</span>
                    <div v-if="deck.list[deckPart.id].length">
                        <ygo-prices
                            :item="deck.list[deckPart.id]"
                            :is-group="true"
                            :price-data="price.data"
                            :price-active-currency="price.activeCurrency"
                        ></ygo-prices>
                        <div class="deck-content">
                            <ygo-card
                                v-for="(cardId, index) in deck.list[deckPart.id]"
                                :key="`${cardId}_${index}`"
                                :card-id="cardId"
                                :card-name="cards.data.get(cardId)"
                                :deck-card-remove="()=>deckCardRemove(deckPart,cardId)"
                            >
                                <ygo-prices
                                    slot="price"
                                    :item="cardId"
                                    :is-group="false"
                                    :price-data="price.data"
                                    :price-active-currency="price.activeCurrency"
                                ></ygo-prices>
                            </ygo-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- app-builder -->
        <div class="app-section app-builder">
            <h2>Deckbuilder:</h2>
            <ygo-builder
                v-if="ajax.namesLoaded"
                :cards-pairs="cards.pairs"
                :deck-parts="deck.parts"
                :deck-card-add="deckCardAdd"
            ></ygo-builder>
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
import filterOutOnce from "./lib/filterOutOnce";
import deckParts from "./lib/data/deckParts";
import priceCurrencies from "./lib/data/priceCurrencies";
import getUrls from "./lib/data/urls";

import YgoPrices from "./components/YgoPrices.vue";
import YgoCard from "./components/YgoCard.vue";
import YgoBuilder from "./components/YgoBuilder.vue";

const urls = getUrls();

export default {
  name: "app",
  components: { YgoPrices, YgoCard, YgoBuilder },
  data: () => {
    return {
      cards: {
        pairs: new Map(),
        data: new Map()
      },
      price: {
        activeCurrency: priceCurrencies[0],
        currencies: priceCurrencies,
        data: new Map()
      },
      ajax: {
        namesLoaded: false,
        pricesLoaded: false,
        currentlyLoading: false
      },
      deck: {
        name: "Unnamed",
        parts: deckParts,
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
      vm.ajax.currentlyLoading = true;

      apiLoadNames(urls)
        .then(result => {
          vm.cards.data = result.data;
          vm.cards.pairs = result.pairs;

          vm.ajax.namesLoaded = true;
          vm.ajax.currentlyLoading = false;

          console.log("LOADED NAMES", vm.cards.data);
        })
        .catch(console.error);
    },
    fetchPrices() {
      const vm = this;

      vm.ajax.pricesLoaded = false;
      vm.ajax.currentlyLoading = true;

      apiLoadPrices(urls, vm.deck.list, vm.cards.data, vm.price.data)
        .then(result => {
          if (result !== false) {
            vm.price.data = result;
          }

          console.log("LOADED PRICES", vm.price.data);

          vm.ajax.pricesLoaded = true;
          vm.ajax.currentlyLoading = false;
        })
        .catch(console.error);
    },
    deckFromFile(file) {
      const vm = this;
      const reader = new FileReader();

      reader.onload = e => {
        vm.deck.name = file.name.replace(".ydk", "");
        vm.deck.list = convertFileToDeck(vm.deck.parts, e.target.result);
      };

      reader.readAsText(file);
    },
    deckToFile() {
      const fileData = convertDeckToFile(this.deck.parts, this.deck.list);
      const file = new File([fileData], `${this.deck.name}.ydk`, {
        type: "text/ydk"
      });

      return FileSaver.saveAs(file);
    },
    deckFromUri(uriDeck) {
      const deckArray = uriDeckDecode(this.deck.parts, uriDeck);

      this.deck.list = deckArray;
    },
    deckToUri() {
      return uriDeckEncode(this.deck.list);
    },
    deckToText() {
      return convertDeckToText(this.deck.parts, this.cards.data, this.deck);
    },
    deckCardAdd(deckpart, cardId) {
      const activeSection = this.deck.list[deckpart.id];

      if (
        activeSection.length < deckpart.limit &&
        activeSection.filter(
          activeSectionCardId => activeSectionCardId === cardId
        ).length < 3
      ) {
        activeSection.push(cardId);
      }
    },
    deckCardRemove(deckpart, cardId) {
      const activeSection = this.deck.list[deckpart.id];

      if (activeSection.includes(cardId)) {
        this.deck.list[deckpart.id] = filterOutOnce(activeSection, cardId);
      }
    },
    fileOnUpload(e) {
      const files = e.target.files || e.dataTransfer.files;

      this.deckFromFile(files[0]);
    },
    copyShareText() {
      clipboard.copy({
        "text/plain": this.deckToText()
      });
    }
  },
  mounted() {
    this.fetchNames();

    if (location.search.includes("?d")) {
      this.deckFromUri(location.search);
    }
  }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "styles/variables";
@import "styles/variables.app";
@import "styles/bootstrap";

@import "styles/blocks/app";
@import "styles/blocks/forms";
@import "styles/blocks/deck";
</style>
