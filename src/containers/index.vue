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
                    download
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
                        <i class="fa fa-circle-o-notch fa-spin fa-fw"><!----></i>
                    </span>
                </button>
            </div>
        </div>

        <!-- app-deck -->
        <div class="app-section app-deck">
            <h2>Decklist:</h2>
            <div class="deck">
                <div
                    class="deck-part deck-part-total"
                    v-if="ajax.pricesLoaded"
                >
                    <span>Total:</span>
                    <ygo-price-view
                        :item="deck.all"
                        :price-db="priceDb"
                    />
                </div>
                <div
                    class="deck-part"
                    v-for="deckPart in deck.parts"
                    :key="deckPart.id"
                    :class="`deck-part-${deckPart.id}`"
                >
                    <span>{{ deckPart.name }} Deck ({{ deck[deckPart.id].length }} Cards):</span>
                    <div v-if="deck[deckPart.id].length">
                        <ygo-price-view
                            v-if="ajax.pricesLoaded"
                            :item="deck[deckPart.id]"
                            :price-db="priceDb"
                        />
                        <div class="deck-content">
                            <ygo-card
                                v-for="(cardId, cardIndex) in deck[deckPart.id]"
                                :key="`${cardId}_${cardIndex}`"
                                :card-id="cardId"
                                :card-name="cardDb.getName(cardId)"
                                :on-right-click="() => deckCardRemove(deckPart, cardId)"
                            >
                                <ygo-price-view
                                    slot="price"
                                    v-if="ajax.pricesLoaded"
                                    :item="cardId"
                                    :price-db="priceDb"
                                />
                            </ygo-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- app-builder -->
        <div class="app-section app-builder">
            <div class="app-builder-intro">
                <h2>Deckbuilder:</h2>
                <ygo-draw-sim
                    v-if="deck.main.length"
                    :deck-list-main="deck.main"
                    :card-db="cardDb"
                />
            </div>
            <ygo-builder
                v-if="ajax.cardsLoaded"
                :pairs-arr="cardDb.pairsArr"
                :deck-parts="deck.parts"
                :deck-card-can-add="(deckPart,cardId) => deckCardCanAdd(deckPart,cardId)"
                :deck-card-add="(deckPart,cardId) => deckCardAdd(deckPart,cardId)"
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

import ygoPriceView from "../components/ygoPriceView.vue";
import ygoCard from "../components/ygoCard.vue";
import ygoBuilder from "../components/ygoBuilder.vue";
import ygoDrawSim from "../components/ygoDrawSim.vue";

const urls = getUrls();
const stderr = console.error;

export default {
    name: "Index",
    components: { ygoPriceView, ygoCard, ygoBuilder, ygoDrawSim },
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
            //Load encoded uriDeck
            this.deck = Deck.fromUri(uriQuery.replace("?d=", ""));
        } else if (uriQuery.includes("?u=")) {
            //Load remote deck file
            Deck.fromRemoteFile(uriQuery.replace("?d=", ""))
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
        deckCardRemove(deckPart, cardId) {
            this.deck.cardRemove(deckPart, cardId);
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
@import "../styles/variables";
@import "../styles/variables.app";

@import "../styles/bootstrap";
@import "node_modules/bootstrap-vue/dist/bootstrap-vue";

@import "../styles/blocks/general";
@import "../styles/blocks/app";
@import "../styles/blocks/forms";
@import "../styles/blocks/deck";
</style>
