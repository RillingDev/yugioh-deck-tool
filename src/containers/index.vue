<template>
    <div class="app">

        <!-- app-forms -->
        <div class="app-section app-forms">
            <!-- app-forms-upload -->
            <div class="form-group">
                <label>Deck:</label>
                <input
                    class="form-control"
                    type="file"
                    accept=".ydk"
                    @change="fileOnUpload"
                    title="Upload Deck"
                >
                    <input
                        class="form-control form-deck-name"
                        type="text"
                        v-model="deck.name"
                        title="Deck Title"
                        placeholder="Deck Title"
                    >
                        <button
                            class="btn btn-primary form-control"
                            download="Unnamed.ydk"
                            @click="deckToFile"
                            title="Download Deck"
                        >Download</button>
            </div>
            <!-- app-forms-share -->
            <div class="form-group">
                <label>Share:</label>
                <input
                    class="form-control"
                    type="url"
                    :value="shareLink"
                    title="Shareable Link"
                >
                    <button
                        class="btn btn-primary form-control"
                        @click="copyShareText"
                        title="Copy Decklist to Clipboard"
                    >Copy Decklist to Clipboard</button>
            </div>
            <!-- app-forms-price -->
            <div class="form-group">
                <label>Price:</label>
                <select
                    class="form-control form-deck-currency"
                    v-model="priceDb.activeCurrency"
                    title="Price Currency"
                >
                    <option
                        v-for="currency in priceDb.currencies"
                        :key="currency.id"
                        :value="currency"
                    >{{ currency.name }}</option>
                        </select>
                        <button
                            class="btn btn-primary form-control"
                            @click="fetchPrices"
                            title="Load Prices"
                        >
                            <span :hidden="ajax.currentlyLoading">Load Prices</span>
                            <span :hidden="!ajax.currentlyLoading">
                                <span class="fa fa-circle-o-notch fa-spin fa-fw">
                                    <!---->
                                </span>
                            </span>
                            </button>
            </div>
        </div>

        <!-- app-deck -->
        <div class="app-section app-deck">
            <h2>Decklist:</h2>
            <ygo-deck
                v-if="ajax.cardsLoaded"
                :ajax="ajax"
                :deck="deck"
                :card-db="cardDb"
                :price-db="priceDb"
            />
        </div>

        <!-- app-builder -->
        <div class="app-section app-builder">
            <div class="app-builder-intro">
                <h2>Deckbuilder:</h2>
                <ygo-randomizer
                    v-if="ajax.cardsLoaded"
                    :card-db="cardDb"
                    @randomize="deckRandomize"
                />
                <ygo-draw-sim
                    :deck-list-main="deck.main"
                    :card-db="cardDb"
                />
            </div>
            <ygo-builder
                v-if="ajax.cardsLoaded"
                :pairs-arr="cardDb.pairsArr"
                :deck-card-can-add="deckCardCanAdd"
                @deckcardadd="deckCardAdd"
            />
        </div>
    </div>
</template>

<script>
import FileSaver from "file-saver/FileSaver";
import clipboard from "clipboard-polyfill";

import CardDatabase from "../lib/classes/cardDatabase";
import PriceDatabase from "../lib/classes/priceDatabase";
import Deck from "../lib/classes/deck";

import apiLoadCards from "../lib/apiLoadCards";
import apiLoadPrices from "../lib/apiLoadPrices";
import getUrls from "../lib/data/urls";

import ygoBuilder from "../components/ygoBuilder.vue";
import ygoDeck from "../components/ygoDeck.vue";
import ygoDrawSim from "../components/ygoDrawSim.vue";
import ygoRandomizer from "../components/ygoRandomizer.vue";

// eslint-disable-next-line no-console
const stderr = console.error;
const urls = getUrls();

export default {
    name: "Index",
    components: { ygoBuilder, ygoDrawSim, ygoDeck, ygoRandomizer },
    data: () => {
        return {
            cardDb: new CardDatabase(),
            priceDb: new PriceDatabase(),
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
                .catch(stderr);
        }
    },
    methods: {
        fetchCards() {
            this.ajax.cardsLoaded = false;
            this.ajax.currentlyLoading = true;

            apiLoadCards(urls)
                .then(result => {
                    this.cardDb = new CardDatabase(result);

                    this.ajax.cardsLoaded = true;
                    this.ajax.currentlyLoading = false;
                })
                .catch(stderr);
        },
        fetchPrices() {
            this.ajax.pricesLoaded = false;
            this.ajax.currentlyLoading = true;

            apiLoadPrices(urls, this.deck.all, this.cardDb, this.priceDb)
                .then(() => {
                    this.ajax.pricesLoaded = true;
                    this.ajax.currentlyLoading = false;
                })
                .catch(stderr);
        },
        deckToFile() {
            FileSaver.saveAs(this.deck.toFile());
        },
        deckCardCanAdd(deckPart, cardId) {
            return this.deck.cardCanAdd(deckPart, cardId, this.cardDb);
        },
        deckCardAdd(deckPart, cardId) {
            this.deck.cardAdd(deckPart, cardId, this.cardDb);
            this.ajax.pricesLoaded = false;
        },
        deckRandomize(newDeck) {
            this.deck = newDeck;
        },
        fileOnUpload(e) {
            const files = e.target.files || e.dataTransfer.files;

            if (files.length > 0) {
                Deck.fromFile(files[0])
                    .then(deck => (this.deck = deck))
                    .catch(stderr);
            }
        },
        copyShareText() {
            clipboard.writeText(this.deck.toText(this.cardDb));
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/mixins";
@import "node_modules/bootstrap/scss/variables";

@import "../styles/variables.custom";
@import "../styles/reboot.custom";

@import "node_modules/bootstrap/scss/type";
@import "node_modules/bootstrap/scss/grid";
@import "node_modules/bootstrap/scss/forms";
@import "node_modules/bootstrap/scss/buttons";
@import "node_modules/bootstrap/scss/transitions";
@import "node_modules/bootstrap/scss/utilities";

@import "../styles/blocks/general";
@import "../styles/blocks/app";
@import "../styles/blocks/forms";
</style>
