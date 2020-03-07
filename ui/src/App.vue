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
                    v-model="priceController.activeCurrency"
                >
                    <option
                        :key="currency.name"
                        :value="currency"
                        v-for="currency in priceController.currencies"
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
                    class="btn btn-primary form-control"
                    disabled="disabled"
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
                :card-db="cardDatabase"
                :deck="deck"
                :price-db="priceController"
                v-if="!ajax.currentlyLoading"
            />
        </div>

        <!-- app-builder -->
        <!--        <div class="app-section app-builder">-->
        <!--            <h2>Deckbuilder:</h2>-->
        <!--            <div class="app-builder-intro">-->
        <!--                <ygo-sorter :card-db="cardDb" :deck="deck" />-->
        <!--                <ygo-draw-sim :card-db="cardDb" :deck-list-main="deck.main" />-->
        <!--                <ygo-randomizer-->
        <!--                    :card-db="cardDb"-->
        <!--                    @randomize="deckRandomize"-->
        <!--                    v-if="!ajax.currentlyLoading"-->
        <!--                />-->
        <!--            </div>-->
        <!--            <ygo-builder-->
        <!--                :deck-card-can-add="deckCardCanAdd"-->
        <!--                @deckcardadd="deckCardAdd"-->
        <!--                v-if="!ajax.currentlyLoading"-->
        <!--            />-->
        <!--        </div>-->
    </div>
</template>

<script lang="ts">
import logger, { levels } from "loglevel";
import Vue from "vue";
import { PriceController } from "./lib/controller/PriceController";
import Deck from "./lib/deck/Deck";

import { CardDatabase } from "../../core";
import saveFile from "./lib/saveFile";
import copyText from "./lib/copyText";
import YgoDeck from "./components/YgoDeck.vue";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import Component from "vue-class-component";

logger.setLevel(levels.INFO);

@Component({
    components: {
        YgoDeck
    },
    name: "Index"
})
export default class App extends Vue {
    private readonly cardDatabase = uiContainer.get<CardDatabase>(
        UI_TYPES.CardDatabase
    );
    private readonly priceController = uiContainer.get<PriceController>(
        UI_TYPES.PriceController
    );
    public deck = new Deck();
    public readonly ajax = {
        currentlyLoading: true
    };

    get shareLink() {
        const currentUri = location.origin + location.pathname;
        const deckUri = this.deck.toUri();

        return deckUri.length ? `${currentUri}?d=${deckUri}` : currentUri;
    }

    get buyLink() {
        return this.deck.toBuyLink(this.cardDatabase);
    }

    get isDeckEmpty() {
        return this.deck.getAll().length === 0;
    }

    fetchCards() {
        this.ajax.currentlyLoading = true;

        this.cardDatabase
            .init()
            .then(() => {
                this.ajax.currentlyLoading = false;
            })
            .catch(logger.error);
    }

    deckToFile() {
        saveFile(this.deck.toFile());
    }

    deckCardCanAdd(deckPart, cardId, banlist) {
        return this.deck.cardCanAdd(
            deckPart,
            cardId,
            this.cardDatabase,
            banlist
        );
    }

    deckCardAdd(deckPart, cardId, banlist) {
        this.deck.cardAdd(deckPart, cardId, this.cardDatabase, banlist);
    }

    deckRandomize(newDeck) {
        this.deck = newDeck;
    }

    fileOnUpload(e) {
        const files = e.target.files || e.dataTransfer.files;

        if (files.length > 0) {
            Deck.fromFile(files[0])
                .then((deck: Deck) => {
                    this.deck = deck;
                })
                .catch(logger.error);
        }
    }

    copyShareLink() {
        copyText(this.shareLink);
    }

    copyShareText() {
        copyText(this.deck.toText(this.cardDatabase));
    }

    mounted() {
        const uriQuery = location.search;

        this.fetchCards();

        if (uriQuery.includes("?d=")) {
            // Load encoded uriDeck
            this.deck = Deck.fromUri(uriQuery.replace("?d=", ""));
        } else if (uriQuery.includes("?u=")) {
            // Load remote deck file
            Deck.fromRemoteFile(uriQuery.replace("?u=", ""))
                .then((deck: Deck) => (this.deck = deck))
                .catch(logger.error);
        }
    }
}
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
