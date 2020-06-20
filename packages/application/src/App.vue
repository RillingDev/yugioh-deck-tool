<template>
    <BOverlay :show="!loaded">
        <AppHeader />
        <hr />
        <AppMain />
    </BOverlay>
</template>

<script lang="ts">
import {
    CardDatabase,
    DeckFileService,
    DeckUriEncodingService,
    getLogger,
    UrlService,
} from "../../core/src/main";
import { applicationContainer } from "./inversify.config";
import { APPLICATION_TYPES } from "./types";
import AppHeader from "./views/AppHeader.vue";
import { DECK_REPLACE } from "./store/modules/deck";
import AppMain from "./views/AppMain.vue";
import { defineComponent, onMounted } from "@vue/composition-api";
import { DATA_LOADED } from "./store/modules/data";
import { BOverlay } from "bootstrap-vue";
import { appStore } from "./composition/appStore";
import { dataLoaded } from "./composition/dataLoaded";

const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);
const deckFileService = applicationContainer.get<DeckFileService>(
    APPLICATION_TYPES.DeckFileService
);
const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
    APPLICATION_TYPES.DeckUriEncodingService
);

const logger = getLogger("App");

export default defineComponent({
    components: {
        AppMain,
        AppHeader,
        BOverlay,
    },
    props: {},
    setup: (props, context) => {
        const loaded = dataLoaded(context);

        const loadUriDeck = async (): Promise<void> => {
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
                return deckFileService
                    .fromRemoteFile(location.origin, remoteUrlValue)
                    .then((result) => {
                        appStore(context).commit(DECK_REPLACE, {
                            deck: result.deck,
                        });
                    });
            } else if (uriEncodedDeck != null) {
                // Load encoded uri deck
                const deck = deckUriEncodingService.fromUrlQueryParamValue(
                    uriEncodedDeck
                );
                appStore(context).commit(DECK_REPLACE, { deck });
            } else if (legacyUriEncodedDeck != null) {
                // Check for legacy share link
                // Due to the old link containing illegal characters parseUrl causes issues
                const deck = deckUriEncodingService.fromLegacyUrlQueryParamValue(
                    legacyUriEncodedDeck,
                    atob
                );
                appStore(context).commit(DECK_REPLACE, { deck });
            }
            return Promise.resolve();
        };

        cardDatabase
            .prepareAll()
            .catch((err) => {
                logger.error("Could not load data!", err);
                context.root.$bvToast.toast("Could not load data!", {
                    variant: "warning",
                    noCloseButton: true,
                    toastClass: "deck-tool__portal",
                });
            })
            .then(() => {
                appStore(context).commit(DATA_LOADED);
                return loadUriDeck();
            })
            .then(() => logger.info("Ready."))
            .catch((err) => {
                logger.error("Could not load deck!", err);
                context.root.$bvToast.toast("Could not load deck!", {
                    variant: "warning",
                    noCloseButton: true,
                    toastClass: "deck-tool__portal",
                });
            });

        return { loaded };
    },
});
</script>
