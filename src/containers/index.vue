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
                    title="Upload Deck"
                    @change="fileOnUpload"
                >
                <input
                    v-model="deck.name"
                    class="form-control form-deck-name"
                    type="text"
                    title="Deck Title"
                    placeholder="Deck Title"
                >
                <button
                    class="btn btn-primary form-control"
                    download="Unnamed.ydk"
                    title="Download Deck"
                    @click="deckToFile"
                >Download</button>
            </div>
            <!-- app-forms-share -->
            <div class="form-group">
                <label>Share:</label>
                <input
                    :value="shareLink"
                    class="form-control"
                    type="url"
                    title="Shareable Link"
                >
                <button
                    class="btn btn-primary btn-tiny form-control"
                    title="Copy Sharelink to Clipboard"
                    @click="copyShareLink"
                >
                    <span class="fa fa-clipboard"><!-- icon--></span>
                </button>
                <button
                    class="btn btn-primary form-control"
                    title="Copy Decklist to Clipboard"
                    @click="copyShareText"
                >Copy Decklist to Clipboard</button>
            </div>
            <!-- app-forms-price -->
            <div class="form-group">
                <label>Price:</label>
                <select
                    v-model="priceDb.activeCurrency"
                    class="form-control form-deck-currency"
                    title="Price Currency"
                >
                    <option
                        v-for="currency in priceDb.currencies"
                        :key="currency.name"
                        :value="currency"
                    >{{ currency.name }}</option>
                </select>
                <button
                    class="btn btn-primary form-control"
                    title="Load Prices"
                    @click="fetchPrices"
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
            <h2>Deckbuilder:</h2>
            <div class="app-builder-intro">
                <ygo-draw-sim
                    :deck-list-main="deck.main"
                    :card-db="cardDb"
                />
                <ygo-randomizer
                    v-if="ajax.cardsLoaded"
                    :card-db="cardDb"
                    @randomize="deckRandomize"
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
import CardDatabase from "../lib/classes/cardDatabase";
import PriceDatabase from "../lib/classes/priceDatabase";
import Deck from "../lib/classes/deck";

import apiLoadCards from "../lib/apiLoadCards";
import apiLoadPrices from "../lib/apiLoadPrices";
import getUrls from "../lib/data/urls";
import saveFile from "../lib/saveFile";

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
                    .catch(stderr);
            }
        },
        copyShareLink() {
            navigator.clipboard.writeText(this.shareLink).catch(stderr);
        },
        copyShareText() {
            navigator.clipboard
                .writeText(this.deck.toText(this.cardDb))
                .catch(stderr);
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
@import "../styles/blocks/forms";

@import "../styles/blocks/ygoprodeck";
</style>
