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
                    @input="deckUpdate()"
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
                    v-model="price.activeCurrency"
                    title="Price Currency"
                >
                    <option
                        v-for="currency in price.currencies"
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
                        :item="deckListAll"
                        :price-data="price.data"
                        :price-active-currency="price.activeCurrency"
                    />
                </div>
                <div
                    class="deck-part"
                    v-for="deckPart in deck.parts"
                    :key="deckPart.id"
                    :class="`deck-part-${deckPart.id}`"
                >
                    <span>{{ deckPart.name }} Deck ({{ deck.list[deckPart.id].length }} Cards):</span>
                    <div v-if="deck.list[deckPart.id].length">
                        <ygo-price-view
                            v-if="ajax.pricesLoaded"
                            :item="deck.list[deckPart.id]"
                            :price-data="price.data"
                            :price-active-currency="price.activeCurrency"
                        />
                        <div class="deck-content">
                            <ygo-card
                                v-for="(cardId, index) in deck.list[deckPart.id]"
                                :key="`${cardId}_${index}`"
                                :card-id="cardId"
                                :card-name="cardDb.getName(cardId)"
                                :on-right-click="() => deckCardRemove(deckPart, cardId)"
                            >
                                <ygo-price-view
                                    slot="price"
                                    v-if="ajax.pricesLoaded"
                                    :item="cardId"
                                    :price-data="price.data"
                                    :price-active-currency="price.activeCurrency"
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
                    v-if="deck.list.main.length"
                    :deck-list-main="deck.list.main"
                    :card-db="cardDb"
                />
            </div>
            <ygo-builder
                v-if="ajax.cardsLoaded"
                :card-db="cardDb"
                :deck-parts="deck.parts"
                :deck-card-add="deckCardAdd"
            />
        </div>
    </div>
</template>

<script>
import FileSaver from "file-saver/FileSaver";
import clipboard from "clipboard-polyfill";
import { arrRemoveItem, objValues } from "lightdash";

import { uriDeckDecode, uriDeckEncode } from "../lib/uriDeck";
import apiLoadCards from "../lib/apiLoadCards";
import apiLoadPrices from "../lib/apiLoadPrices";
import apiLoadRemoteDeck from "../lib/apiLoadRemoteDeck";
import convertFileToDeck from "../lib/convertFileToDeck";
import convertDeckToFile from "../lib/convertDeckToFile";
import convertDeckToText from "../lib/convertDeckToText";

import deckParts from "../lib/data/deckParts";
import priceCurrencies from "../lib/data/priceCurrencies";
import getUrls from "../lib/data/urls";

import ygoPriceView from "../components/ygoPriceView.vue";
import ygoCard from "../components/ygoCard.vue";
import ygoBuilder from "../components/ygoBuilder.vue";
import ygoDrawSim from "../components/ygoDrawSim.vue";

const urls = getUrls();

export default {
    name: "Index",
    components: { ygoPriceView, ygoCard, ygoBuilder, ygoDrawSim },
    data: () => {
        return {
            cardDb: null,
            price: {
                activeCurrency: priceCurrencies[0],
                currencies: priceCurrencies,
                data: new Map()
            },
            ajax: {
                cardsLoaded: false,
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
            const currentUri = location.origin + location.pathname;
            const deckUri = this.deckToUri();

            return deckUri.length ? `${currentUri}?d=${deckUri}` : currentUri;
        },
        deckListAll() {
            return [].concat(...objValues(this.deck.list));
        }
    },
    mounted() {
        const uriQuery = location.search;

        this.fetchCards();

        if (uriQuery.includes("?d=")) {
            //Load encoded uriDeck
            this.deckFromUri(uriQuery.replace("?d=", ""));
        } else if (uriQuery.includes("?u=")) {
            //Load remote deck file
            apiLoadRemoteDeck(uriQuery.replace("?u=", "").trim())
                .then(text => {
                    this.deck.list = convertFileToDeck(this.deck.parts, text);
                })
                .catch(err => {
                    console.error(
                        "Remote Deck could not be loaded:",
                        err.statusText
                    );
                });
        }
    },
    methods: {
        fetchCards() {
            this.ajax.cardsLoaded = false;
            this.ajax.currentlyLoading = true;

            apiLoadCards(urls)
                .then(result => {
                    this.cardDb = result;

                    this.ajax.cardsLoaded = true;
                    this.ajax.currentlyLoading = false;

                    console.log("LOADED Cards", this.cardDb);
                })
                .catch(console.error);
        },
        fetchPrices() {
            this.ajax.pricesLoaded = false;
            this.ajax.currentlyLoading = true;

            /*  apiLoadPrices(
                urls,
                this.deckListAll,
                this.cards.data,
                this.price.data
            )
                .then(result => {
                    if (result !== false) {
                        this.price.data = result;
                    }

                    console.log("LOADED PRICES", this.price.data);

                    if (this.price.data.size > 0) {
                        this.ajax.pricesLoaded = true;
                    }

                    this.ajax.currentlyLoading = false;
                })
                .catch(console.error); */
        },
        deckFromFile(file) {
            const reader = new FileReader();

            this.ajax.pricesLoaded = false;

            reader.onload = e => {
                this.deck.name = file.name.replace(".ydk", "");
                this.deck.list = convertFileToDeck(
                    this.deck.parts,
                    e.target.result
                );
            };

            if (file) {
                reader.readAsText(file);
            }
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
            return convertDeckToText(
                this.deck.parts,
                this.cards.data,
                this.deck
            );
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
                this.ajax.pricesLoaded = false;
            }
        },
        deckCardRemove(deckpart, cardId) {
            const activeSection = this.deck.list[deckpart.id];

            if (activeSection.includes(cardId)) {
                this.deck.list[deckpart.id] = arrRemoveItem(
                    activeSection,
                    cardId
                );
            }
        },
        fileOnUpload(e) {
            const files = e.target.files || e.dataTransfer.files;

            this.deckFromFile(files[0]);
        },
        copyShareText() {
            clipboard.writeText(this.deckToText());
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
