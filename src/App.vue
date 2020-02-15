<template>
  <div class="app">
    <!-- app-forms -->
    <div class="app-section app-forms">
      <!-- app-forms-upload -->
      <div class="form-group">
        <label>Deck:</label>
        <input
          @change="fileOnUpload"
          accept=".ydk"
          class="form-control"
          title="Upload Deck"
          type="file"
        />
        <input
          class="form-control form-deck-name"
          placeholder="Deck Title"
          title="Deck Title"
          type="text"
          v-model="deck.name"
        />
        <button
          @click="deckToFile"
          class="btn btn-primary form-control"
          download="Unnamed.ydk"
          title="Download Deck"
        >
          Download
        </button>
      </div>
      <!-- app-forms-share -->
      <div class="form-group">
        <label>Share:</label>
        <input
          :value="shareLink"
          class="form-control"
          title="Shareable Link"
          type="url"
        />
        <button
          :disabled="isDeckEmpty"
          @click="copyShareLink"
          class="btn btn-primary btn-tiny form-control"
          title="Copy Sharelink to Clipboard"
        >
          <span class="fas fa-share-square"><!-- icon--></span>
        </button>
        <button
          :disabled="isDeckEmpty"
          @click="copyShareText"
          class="btn btn-primary form-control"
          title="Copy Decklist to Clipboard"
        >
          Copy Decklist to Clipboard
        </button>
      </div>
      <!-- app-forms-price -->
      <div class="form-group">
        <label>Price:</label>
        <select
          class="form-control form-deck-currency"
          title="Price Currency"
          v-model="priceDb.activeCurrency"
        >
          <option
            :key="currency.name"
            :value="currency"
            v-for="currency in priceDb.currencies"
          >
            {{ currency.name }}
          </option>
        </select>
        <a
          :class="{ disabled: isDeckEmpty }"
          :disabled="isDeckEmpty"
          :href="buyLink"
          class="btn btn-primary btn-tiny form-control"
          target="_blank"
          title="Open Buy Page"
        >
          <span class="fas fa-shopping-cart"><!-- icon--></span>
        </a>
        <button
          :disabled="isDeckEmpty"
          @click="fetchPrices"
          class="btn btn-primary form-control"
          title="Load Prices"
        >
          <span :hidden="ajax.currentlyLoading">Load Prices</span>
          <span :hidden="!ajax.currentlyLoading">
            <span class="fas fa-spinner fa-spin fa-fw">
              <!-- icon -->
            </span>
          </span>
        </button>
      </div>
    </div>

    <!-- app-deck -->
    <div class="app-section app-deck">
      <h2>Decklist:</h2>
      <ygo-deck
        :ajax="ajax"
        :card-db="cardDb"
        :deck="deck"
        :price-db="priceDb"
        v-if="ajax.cardsLoaded"
      />
    </div>

    <!-- app-builder -->
    <div class="app-section app-builder">
      <h2>Deckbuilder:</h2>
      <div class="app-builder-intro">
        <ygo-sorter :card-db="cardDb" :deck="deck" />
        <ygo-draw-sim :card-db="cardDb" :deck-list-main="deck.main" />
        <ygo-randomizer
          :card-db="cardDb"
          @randomize="deckRandomize"
          v-if="ajax.cardsLoaded"
        />
      </div>
      <ygo-builder
        :deck-card-can-add="deckCardCanAdd"
        :pairs-arr="cardDb.pairsArr"
        :sets="cardDb.sets"
        @deckcardadd="deckCardAdd"
        v-if="ajax.cardsLoaded"
      />
    </div>
  </div>
</template>

<script>
import CardDb from "./lib/cardDb/CardDb";
import PriceDb from "./lib/priceDb/PriceDb";
import Deck from "./lib/deck/Deck";

import apiLoadCards from "./lib/cardDb/apiLoadCards";
import apiLoadPrices from "./lib/priceDb/apiLoadPrices";
import saveFile from "./lib/saveFile";
import copyText from "./lib/copyText";

import ygoBuilder from "./components/YgoBuilder.vue";
import ygoDeck from "./components/YgoDeck.vue";
import ygoSorter from "./components/YgoSorter.vue";
import ygoDrawSim from "./components/YgoDrawSim.vue";
import ygoRandomizer from "./components/YgoRandomizer.vue";

export default {
  name: "Index",
  components: { ygoBuilder, ygoDeck, ygoSorter, ygoDrawSim, ygoRandomizer },
  data: () => {
    return {
      cardDb: new CardDb(),
      priceDb: new PriceDb(),
      deck: new Deck(),
      ajax: {
        cardsLoaded: false,
        pricesLoaded: false,
        currentlyLoading: false
      }
    };
  },
  computed: {
    shareLink() {
      const currentUri = location.origin + location.pathname;
      const deckUri = this.deck.toUri();

      return deckUri.length ? `${currentUri}?d=${deckUri}` : currentUri;
    },
    buyLink() {
      return this.deck.toBuyLink(this.cardDb);
    },
    isDeckEmpty() {
      return this.deck.all.length === 0;
    }
  },
  mounted() {
    const uriQuery = location.search;

    this.fetchCards();

    if (uriQuery.includes("?d=")) {
      // Load encoded uriDeck
      this.deck = Deck.fromUri(uriQuery.replace("?d=", ""));
    } else if (uriQuery.includes("?u=")) {
      // Load remote deck file
      Deck.fromRemoteFile(uriQuery.replace("?u=", ""))
        .then(deck => (this.deck = deck))
        .catch(console.error);
    }
  },
  methods: {
    fetchCards() {
      this.ajax.cardsLoaded = false;
      this.ajax.currentlyLoading = true;

      apiLoadCards()
        .then(result => {
          this.cardDb = new CardDb(result);

          this.ajax.cardsLoaded = true;
          this.ajax.currentlyLoading = false;
        })
        .catch(console.error);
    },
    fetchPrices() {
      this.ajax.pricesLoaded = false;
      this.ajax.currentlyLoading = true;

      apiLoadPrices(this.deck.all, this.cardDb, this.priceDb)
        .then(() => {
          this.ajax.pricesLoaded = true;
          this.ajax.currentlyLoading = false;
        })
        .catch(console.error);
    },
    deckToFile() {
      saveFile(this.deck.toFile());
    },
    deckCardCanAdd(deckPart, cardId, banlist) {
      return this.deck.cardCanAdd(deckPart, cardId, this.cardDb, banlist);
    },
    deckCardAdd(deckPart, cardId, banlist) {
      this.deck.cardAdd(deckPart, cardId, this.cardDb, banlist);
      this.ajax.pricesLoaded = false;
    },
    deckRandomize(newDeck) {
      this.deck = newDeck;
      this.ajax.pricesLoaded = false;
    },
    fileOnUpload(e) {
      const files = e.target.files || e.dataTransfer.files;

      if (files.length > 0) {
        Deck.fromFile(files[0])
          .then(deck => {
            this.deck = deck;
            this.ajax.pricesLoaded = false;
          })
          .catch(console.error);
      }
    },
    copyShareLink() {
      copyText(this.shareLink);
    },
    copyShareText() {
      copyText(this.deck.toText(this.cardDb));
    }
  }
};
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "styles/variables.custom";
@import "styles/reboot.custom";

@import "~bootstrap/scss/type";
@import "~bootstrap/scss/grid";
@import "~bootstrap/scss/forms";
@import "~bootstrap/scss/buttons";
@import "~bootstrap/scss/utilities";

@import "~bootstrap-vue/dist/bootstrap-vue.css";

@import "styles/blocks/general";
@import "styles/blocks/forms";

@import "styles/blocks/ygoprodeck";
</style>
