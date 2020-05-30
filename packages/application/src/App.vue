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
                    v-model="deckName"
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
                    :initial-options="currencies"
                    :label="(currency) => currency.name"
                    :track-by="(currency) => currency.name"
                    class="form-control form-deck-currency"
                    v-model="activeCurrency"
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
            <AdvancedSelect
                :initial-options="formats"
                class="form-control form-deck-currency"
                v-model="activeFormat"
            ></AdvancedSelect>
            <div class="app-builder-intro">
                <ygo-sorter />
                <ygo-draw-sim />
                <ygo-randomizer />
            </div>
        </div>

        <AppMain v-if="!ajax.currentlyLoading" />
        <div v-else class="text-center">
            <span>Loading Card Database...</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
    CardDatabase,
    Currency,
    Deck,
    DeckExportService,
    DeckFileService,
    DeckService,
    DeckUriEncodingService,
    DEFAULT_CURRENCY_ARR,
    getLogger,
    UrlService,
    Format,
} from "yugioh-deck-tool-core/src/main";
import { copyText, readFile, saveFile } from "yugioh-deck-tool-ui/src/main";
import YgoDeck from "./components/deck/YgoDeck.vue";
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";
import Component from "vue-class-component";
import YgoSorter from "@/components/YgoSorter.vue";
import YgoDrawSim from "@/components/YgoDrawSim.vue";
import YgoBuilder from "@/components/builder/YgoBuilder.vue";
import YgoRandomizer from "@/components/YgoRandomizer.vue";
import AdvancedSelect from "@/components/AdvancedSelect.vue";
import { CURRENCY_UPDATE } from "@/store/modules/currency";
import { DECK_REPLACE, DECK_NAME_UPDATE } from "@/store/modules/deck";
import { FORMAT_UPDATE } from "@/store/modules/format";
import AppMain from "@/components/AppMain.vue";

const logger = getLogger("app");

@Component({
    components: {
        AppMain,
        YgoSorter,
        YgoDrawSim,
        YgoRandomizer,
        AdvancedSelect,
    },
    name: "Index",
})
export default class App extends Vue {
    readonly ajax = {
        currentlyLoading: true,
    };
    readonly currencies = DEFAULT_CURRENCY_ARR;
    readonly formats = Object.values(Format);
    private readonly deckService = applicationContainer.get<DeckService>(
        APPLICATION_TYPES.DeckService
    );
    private readonly deckExportService = applicationContainer.get<
        DeckExportService
    >(APPLICATION_TYPES.DeckExportService);
    private readonly deckUriEncodingService = applicationContainer.get<
        DeckUriEncodingService
    >(APPLICATION_TYPES.DeckUriEncodingService);
    private readonly deckFileService = applicationContainer.get<
        DeckFileService
    >(APPLICATION_TYPES.DeckFileService);

    get activeCurrency(): Currency {
        return this.$store.state.currency.active;
    }

    set activeCurrency(newCurrency: Currency) {
        this.$store.commit(CURRENCY_UPDATE, { currency: newCurrency });
    }

    get activeFormat(): Format {
        return this.$store.state.format.active;
    }

    set activeFormat(newFormat: Format) {
        this.$store.commit(FORMAT_UPDATE, { format: newFormat });
    }

    get deck(): Deck {
        return this.$store.state.deck.active;
    }

    set deck(newDeck: Deck) {
        this.$store.commit(DECK_REPLACE, { deck: newDeck });
    }

    get deckName(): string {
        return this.$store.state.deck.active.name;
    }

    set deckName(newName: string) {
        this.$store.commit(DECK_NAME_UPDATE, { name: newName });
    }

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
        saveFile(new File([fileContent], fileName), document);
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
        copyText(this.shareLink, document);
    }

    copyShareText() {
        copyText(this.deckExportService.toShareableText(this.deck), document);
    }

    mounted() {
        this.ajax.currentlyLoading = true;
        const cardDatabase = applicationContainer.get<CardDatabase>(
            APPLICATION_TYPES.CardDatabase
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
        const urlService = applicationContainer.get<UrlService>(
            APPLICATION_TYPES.UrlService
        );
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

<style lang="scss"></style>
