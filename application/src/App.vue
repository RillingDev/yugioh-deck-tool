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
                <AdvancedSelect
                    :initial-options="priceController.currencies"
                    :label="(currency) => currency.name"
                    :track-by="(currency) => currency.name"
                    class="form-control form-deck-currency"
                    v-model="priceController.activeCurrency"
                ></AdvancedSelect>
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
            </div>
        </div>

        <!-- app-deck -->
        <div class="app-section app-deck">
            <h2>Decklist:</h2>
            <div class="text-center" v-if="ajax.currentlyLoading">
                <span>Loading Card Database...</span>
            </div>
            <ygo-deck :deck="deck" v-if="!ajax.currentlyLoading" />
        </div>

        <!-- app-builder -->
        <div class="app-section app-builder">
            <h2>Deckbuilder:</h2>
            <div class="app-builder-intro">
                <ygo-sorter :deck="deck" />
                <ygo-draw-sim :deck="deck" />
                <ygo-randomizer :deck="deck" />
            </div>
            <ygo-builder
                :can-add="canAdd"
                v-if="!ajax.currentlyLoading"
                v-on:deck-card-add="
                    (e, { deckPart, card }) => addCard(deckPart, card)
                "
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PriceController } from "./lib/controller/PriceController";

import {
    Card,
    CardDatabase,
    Deck,
    DeckExportService,
    DeckFileService,
    DeckPart,
    DeckService,
    DeckUriEncodingService,
    Format,
    getLogger,
    UrlService,
} from "../../core/src/main";
import { saveFile } from "./lib/saveFile";
import { copyText } from "./lib/copyText";
import YgoDeck from "./components/YgoDeck.vue";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import Component from "vue-class-component";
import { readFile } from "@/lib/readFile";
import YgoSorter from "@/components/YgoSorter.vue";
import YgoDrawSim from "@/components/YgoDrawSim.vue";
import YgoBuilder from "@/components/YgoBuilder.vue";
import YgoRandomizer from "@/components/YgoRandomizer.vue";
import AdvancedSelect from "@/components/AdvancedSelect.vue";

const logger = getLogger("app");

@Component({
    components: {
        YgoDeck,
        YgoSorter,
        YgoDrawSim,
        YgoBuilder,
        YgoRandomizer,
        AdvancedSelect,
    },
    name: "Index",
})
export default class App extends Vue {
    readonly ajax = {
        currentlyLoading: true,
    };
    private readonly deckService = uiContainer.get<DeckService>(
        UI_TYPES.DeckService
    );
    deck: Deck = this.deckService.createEmptyDeck();
    private readonly deckExportService = uiContainer.get<DeckExportService>(
        UI_TYPES.DeckExportService
    );
    private readonly deckUriEncodingService = uiContainer.get<
        DeckUriEncodingService
    >(UI_TYPES.DeckUriEncodingService);
    private readonly deckFileService = uiContainer.get<DeckFileService>(
        UI_TYPES.DeckFileService
    );
    private readonly priceController = uiContainer.get<PriceController>(
        UI_TYPES.PriceController
    );

    get shareLink() {
        const currentUri = location.origin + location.pathname;
        const deckUri = this.deckUriEncodingService.toUrlQueryParamValue(
            this.deck
        );

        return this.isDeckEmpty ? currentUri : `${currentUri}?e=${deckUri}`;
    }

    get buyLink() {
        return this.deckExportService.toBuyLink(this.deck);
    }

    get isDeckEmpty() {
        return this.deckService.getAllCards(this.deck).length === 0;
    }

    deckToFile() {
        const { fileName, fileContent } = this.deckFileService.toFile(
            this.deck
        );
        saveFile(new File([fileContent], fileName));
    }

    canAdd(deckPart: DeckPart, card: Card, format: Format) {
        return this.deckService.canAdd(this.deck, deckPart, format, card);
    }

    addCard(deckPart: DeckPart, card: Card) {
        this.deck.parts = this.deckService.addCard(
            this.deck,
            deckPart,
            card
        ).parts;
    }

    fileOnUpload(e) {
        const files = e.target.files || e.dataTransfer.files;

        if (files.length > 0) {
            const file = files[0];
            readFile(file)
                .then((fileContent) => {
                    const result = this.deckFileService.fromFile({
                        fileContent,
                        fileName: file.name,
                    });
                    this.deck = result.deck;
                })
                .catch((err) => logger.error("Could not read file!", err));
        }
    }

    copyShareLink() {
        copyText(this.shareLink);
    }

    copyShareText() {
        copyText(this.deckExportService.toShareableText(this.deck));
    }

    mounted() {
        this.ajax.currentlyLoading = true;
        const cardDatabase = uiContainer.get<CardDatabase>(
            UI_TYPES.CardDatabase
        );

        cardDatabase
            .prepareAll()
            .then(() => {
                this.ajax.currentlyLoading = false;
                return this.loadUriDeck();
            })
            .then(() => logger.info("Ready."))
            .catch((err) => logger.error("Could not prepare database!", err));
    }

    private async loadUriDeck(): Promise<void> {
        const urlService = uiContainer.get<UrlService>(UI_TYPES.UrlService);
        const url = location.toString();
        const remoteUrlValue = urlService.getSingleQueryParam(url, "u");
        const uriEncodedDeck = urlService.getSingleQueryParam(url, "e");
        const legacyUriEncodedDeck = urlService.getSingleQueryParam(
            url,
            "d",
            false
        );

        if (remoteUrlValue != null) {
            // Load deck file from a remote URL
            return this.deckFileService
                .fromRemoteFile(location.origin, remoteUrlValue)
                .then((result) => {
                    this.deck = result.deck;
                });
        } else if (uriEncodedDeck != null) {
            // Load encoded uri deck
            this.deck = this.deckUriEncodingService.fromUrlQueryParamValue(
                uriEncodedDeck
            );
        } else if (legacyUriEncodedDeck != null) {
            // Check for legacy share link
            // Due to the old link containing illegal characters parseUrl causes issues
            this.deck = this.deckUriEncodingService.fromLegacyUrlQueryParamValue(
                legacyUriEncodedDeck,
                atob
            );
        }
        return Promise.resolve();
    }
}
</script>

<style lang="scss">
@import "./styles/variables.custom";

@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "~bootstrap-vue/src/variables";

@import "styles/reboot.custom";

.decktool,
.decktool-modal {
    @import "~bootstrap/scss/transitions";
    @import "~bootstrap/scss/type";
    @import "~bootstrap/scss/grid";
    @import "~bootstrap/scss/forms";
    @import "~bootstrap/scss/buttons";
    @import "~bootstrap/scss/button-group";
    @import "~bootstrap/scss/close";
}
// Required outside due to how modal overlay works
@import "~bootstrap/scss/modal";
@import "~bootstrap-vue/src/components/modal/index";

@import "styles/blocks/general";
@import "styles/blocks/forms";
</style>
