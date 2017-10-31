<template>
    <div class="main-form">
        <div class="form-app-wrapper form-group">
            <label class="form-app-label">Deck:</label>
            <div class="form-app-item">
                <input class="form-control" id="formUploadDeck" type="file" title="Upload Deck" accept=".ydk" @change="fileOnUpload">
                <input class="form-control deck-name" type="text" title="Deck Title" placeholder="Deck Title" v-model="deck.name" @input="deckUpdate()">
            </div>
            <a class="btn btn-primary form-control" title="Download Deck" download @click="fileDownloadDeck">Download</a>
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
            <div class="btn btn-primary form-control" title="Load Prices" @click="apiLoadPrices">
                <span :hidden="ajax.pricesLoaded">Load Prices</span>
                <span :hidden="!ajax.pricesLoaded">
                    <i class="fa fa-circle-o-notch fa-spin fa-fw"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import FileSaver from "file-saver/FileSaver";
import clipboard from "clipboard-js/clipboard";
import convertDeckToFile from "../lib/convertDeckToFile";
import deckToText from "../lib/deckToText";
import uriDeckEncode from "../lib/uriDeckEncode";

export default {
  props: [
    "deck",
    "deckparts",
    "cards",
    "ajax",
    "price",
    "apiLoadPrices",
    "deckFromFile"
  ],
  data: () => {
    return {};
  },
  methods: {
    fileOnUpload(e) {
      const files = e.target.files || e.dataTransfer.files;

      this.deckFromFile(files[0]);
    },
    fileDownloadDeck() {
      const fileData = convertDeckToFile(this.deckparts, this.deck.list);
      const file = new File([fileData], `${this.deck.name}.ydk`, {
        type: "text/ydk"
      });

      return FileSaver.saveAs(file);
    },
    copyShareText() {
      clipboard.copy({
        "text/plain": deckToText(this.deckparts, this.cards, this.deck)
      });
    }
  },
  computed: {
    shareLink() {
      return location.origin + location.pathname + uriDeckEncode(this.deck);
    }
  }
};
</script>

<style lang="scss">

</style>
