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
                    disabled="disabled"
                    class="btn btn-primary form-control"
                    title="Load Prices"
                >
                    <span :hidden="ajax.currentlyLoading">Ready</span>
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
                :card-db="cardDb"
                :deck="deck"
                :price-db="priceDb"
                v-if="!ajax.currentlyLoading"
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
                    v-if="!ajax.currentlyLoading"
                />
            </div>
            <ygo-builder
                :deck-card-can-add="deckCardCanAdd"
                :pairs-arr="cardDb.pairsArr"
                :sets="cardDb.sets"
                @deckcardadd="deckCardAdd"
                v-if="!ajax.currentlyLoading"
            />
        </div>
    </div>
</template>

<script>
import logger from "loglevel";

import CardDb from "./lib/cardDb/CardDatabase";
import PriceDb from "./lib/priceDb/PriceDatabase";
import Deck from "./lib/deck/Deck";

import { YgoprodeckClient } from "../../core";
import saveFile from "./lib/saveFile";
import copyText from "./lib/copyText";

import ygoBuilder from "./components/YgoBuilder.vue";
import ygoDeck from "./components/YgoDeck.vue";
import ygoSorter from "./components/YgoSorter.vue";
import ygoDrawSim from "./components/YgoDrawSim.vue";
import ygoRandomizer from "./components/YgoRandomizer.vue";

const ygoprodeckClient = new YgoprodeckClient();

export default {
    name: "Index",
    components: { ygoBuilder, ygoDeck, ygoSorter, ygoDrawSim, ygoRandomizer },
    data: () => {
        return {
            cardDb: new CardDb(),
            priceDb: new PriceDb(),
            deck: new Deck(),
            ajax: {
                currentlyLoading: true
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
                .catch(logger.error);
        }
    },
    methods: {
        fetchCards() {
            this.ajax.currentlyLoading = true;

            Promise.all([
                ygoprodeckClient.getCardInfo(),
                ygoprodeckClient.getCardSets()
            ])
                .then(([cardInfo, cardSets]) => {
                    this.cardDb = new CardDb(cardInfo, cardSets);
                    this.priceDb = new PriceDb(cardInfo);
                    this.ajax.currentlyLoading = false;
                })
                .catch(logger.error);
        },
        deckToFile() {
            saveFile(this.deck.toFile());
        },
        deckCardCanAdd(deckPart, cardId, banlist) {
            return this.deck.cardCanAdd(deckPart, cardId, this.cardDb, banlist);
        },
        deckCardAdd(deckPart, cardId, banlist) {
            this.deck.cardAdd(deckPart, cardId, this.cardDb, banlist);
        },
        deckRandomize(newDeck) {
            this.deck = newDeck;
        },
        fileOnUpload(e) {
            const files = e.target.files || e.dataTransfer.files;

            if (files.length > 0) {
                Deck.fromFile(files[0])
                    .then(deck => {
                        this.deck = deck;
                    })
                    .catch(logger.error);
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
@import "styles/variables.custom";
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";
@import "styles/reboot.custom";

@import "~bootstrap/scss/transitions";
@import "~bootstrap/scss/type";
@import "~bootstrap/scss/grid";
@import "~bootstrap/scss/forms";
@import "~bootstrap/scss/buttons";
@import "~bootstrap/scss/modal";
@import "~bootstrap/scss/utilities";

@import "~bootstrap-vue/dist/bootstrap-vue.css";
@import "~vue-multiselect/dist/vue-multiselect.min.css";

@import "styles/blocks/general";
@import "styles/blocks/forms";
@import "styles/blocks/ygoprodeck";
</style>
