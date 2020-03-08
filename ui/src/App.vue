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
            <ygo-deck :deck="deck" v-if="!ajax.currentlyLoading" />
        </div>

<!--         app-builder -->
                <div class="app-section app-builder">
                    <h2>Deckbuilder:</h2>
                    <div class="app-builder-intro">
                        <ygo-sorter :deck="deck" />
<!--                        <ygo-draw-sim :card-db="cardDb" :deck-list-main="deck.main" />-->
<!--                        <ygo-randomizer-->
<!--                            :card-db="cardDb"-->
<!--                            @randomize="deckRandomize"-->
<!--                            v-if="!ajax.currentlyLoading"-->
<!--                        />-->
                    </div>
<!--                    <ygo-builder-->
<!--                        :deck-card-can-add="deckCardCanAdd"-->
<!--                        @deckcardadd="deckCardAdd"-->
<!--                        v-if="!ajax.currentlyLoading"-->
<!--                    />-->
                </div>
    </div>
</template>

<script lang="ts">
import logger, { levels } from "loglevel";
import Vue from "vue";
import { PriceController } from "./lib/controller/PriceController";

import {
    Card,
    CardDatabase,
    Deck,
    DeckImportExportService,
    DeckPart,
    DeckService,
    Format
} from "../../core/src/main";
import saveFile from "./lib/saveFile";
import copyText from "./lib/copyText";
import YgoDeck from "./components/YgoDeck.vue";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import Component from "vue-class-component";
import { readFile } from "@/lib/readFile";
import YgoSorter from "@/components/YgoSorter.vue";

logger.setLevel(levels.INFO);

@Component({
    components: {
        YgoDeck,YgoSorter
    },
    name: "Index"
})
export default class App extends Vue {
    readonly ajax = {
        currentlyLoading: true
    };
    private readonly cardDatabase = uiContainer.get<CardDatabase>(
        UI_TYPES.CardDatabase
    );
    private readonly deckService = uiContainer.get<DeckService>(
        UI_TYPES.DeckService
    );
    deck: Deck = this.deckService.createEmptyDeck();
    private readonly deckImportExportService = uiContainer.get<
        DeckImportExportService
    >(UI_TYPES.DeckImportExportService);
    private readonly priceController = uiContainer.get<PriceController>(
        UI_TYPES.PriceController
    );

    get shareLink() {
        const currentUri = location.origin + location.pathname;
        const deckUri = this.deckImportExportService.toUrlQueryParamValue(
            this.deck
        );

        return this.isDeckEmpty ? currentUri : `${currentUri}?e=${deckUri}`;
    }

    get buyLink() {
        return this.deckImportExportService.toBuyLink(this.deck);
    }

    get isDeckEmpty() {
        return this.deckService.getAllCards(this.deck).length === 0;
    }

    deckToFile() {
        const { fileName, fileContent } = this.deckImportExportService.toFile(
            this.deck
        );
        saveFile(new File([fileContent], fileName));
    }

    canAdd(
        deckPart: DeckPart,
        card: Card,
        format: Format.TCG | Format.OCG | Format.GOAT
    ) {
        return this.deckService.canAdd(this.deck, deckPart, format, card);
    }

    cardAdd(deckPart: DeckPart, card: Card) {
        return this.deckService.addCard(this.deck, deckPart, card);
    }

    fileOnUpload(e) {
        const files = e.target.files || e.dataTransfer.files;

        if (files.length > 0) {
            const file = files[0];
            readFile(file)
                .then(fileContent => {
                    const result = this.deckImportExportService.fromFile({
                        fileContent,
                        fileName: file.name
                    });
                    this.deck = result.deck;
                })
                .catch(logger.error);
        }
    }

    copyShareLink() {
        copyText(this.shareLink);
    }

    copyShareText() {
        copyText(this.deckImportExportService.toShareableText(this.deck));
    }

    mounted() {
        this.ajax.currentlyLoading = true;

        this.cardDatabase
            .init()
            .then(() => {
                this.ajax.currentlyLoading = false;
                return this.loadUriDeck();
            })
            .then(() => logger.info("Ready."))
            .catch(logger.error);
    }

    private async loadUriDeck(): Promise<void> {
        const uriQuery = location.search;
        if (uriQuery.includes("?u=")) {
            return fetch(uriQuery.replace("?u=", ""))
                .then(res => res.text())
                .then(text => {
                    this.deck = this.deckImportExportService.fromFile({
                        fileContent: text,
                        fileName: null
                    }).deck;
                });
        } else if (uriQuery.includes("?e=")) {
            // Load encoded uriDeck
            this.deck = this.deckImportExportService.fromUrlQueryParamValue(
                uriQuery.replace("?e=", "")
            );
        } else if (uriQuery.includes("?d=")) {
            // Load encoded uriDeck
            this.deck = this.deckImportExportService.fromLegacyUrlQueryParamValue(
                uriQuery.replace("?d=", ""),
                atob
            );
        }

        return Promise.resolve();
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
