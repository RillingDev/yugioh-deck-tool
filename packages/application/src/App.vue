<template>
    <BOverlay :show="!loaded">
        <div class="deck-tool__body">
            <div class="deck-tool__body__primary">
                <YgoToolbar />
                <hr />
                <YgoDeck
                    :can-move="canMoveInDeckParts"
                    :drag-group="dragGroup"
                    v-show="loaded"
                />
            </div>
            <div class="deck-tool__body__secondary">
                <YgoBuilder
                    :can-move="canMoveFromBuilder"
                    :drag-group="dragGroup"
                />
            </div>
        </div>
    </BOverlay>
</template>

<script lang="ts">
import {
    CardDatabase,
    Deck,
    DeckFileService,
    DeckPart,
    DeckService,
    DeckUriEncodingService,
    getLogger,
    UrlService,
} from "../../core/src/main";
import { applicationContainer } from "./inversify.config";
import { APPLICATION_TYPES } from "./types";
import { DECK_REPLACE } from "./store/modules/deck";
import { defineComponent } from "@vue/composition-api";
import { DATA_LOADED } from "./store/modules/data";
import { BOverlay } from "bootstrap-vue";
import { appStore } from "./composition/appStore";
import { dataLoaded } from "./composition/dataLoaded";
import { showError } from "./composition/feedback";
import YgoDeck from "./components/deck/YgoDeck.vue";
import YgoBuilder from "./components/builder/YgoBuilder.vue";
import { Vue } from "vue/types/vue";
import YgoToolbar from "./components/toolbar/YgoToolbar.vue";

const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);
const deckFileService = applicationContainer.get<DeckFileService>(
    APPLICATION_TYPES.DeckFileService
);
const deckUriEncodingService = applicationContainer.get<DeckUriEncodingService>(
    APPLICATION_TYPES.DeckUriEncodingService
);
const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);
const urlService = applicationContainer.get<UrlService>(
    APPLICATION_TYPES.UrlService
);

const logger = getLogger("App");

const findParent = (
    el: Vue,
    predicate: (current: Vue) => boolean
): Vue | null => {
    let current = el;
    while (current.$parent != current.$root) {
        if (predicate(current)) {
            return current;
        }
        current = current.$parent;
    }
    return null;
};

// Workaround-ish solution to allow fetching the target deck part of a a drag event.
const findDeckPartForComponent = (el: Vue): DeckPart | null =>
    findParent(el, (current) => current.$props["deckPart"] != null)?.$props[
        "deckPart"
    ];

const loadUriDeck = async (urlString: string): Promise<Deck | null> => {
    const remoteUrlValue = urlService.getSingleQueryParam(urlString, "u");
    if (remoteUrlValue != null) {
        // Load deck file from a remote URL
        const importResult = await deckFileService.fromRemoteFile(
            location.origin,
            remoteUrlValue
        );
        logger.warn(
            `Could not read ${importResult.missing.length} cards in remote deck.`
        );
        return importResult.deck;
    }

    const uriEncodedDeck = urlService.getSingleQueryParam(urlString, "e");
    if (uriEncodedDeck != null) {
        // Load encoded uri deck
        return deckUriEncodingService.fromUrlQueryParamValue(uriEncodedDeck);
    }

    const legacyUriEncodedDeck = urlService.getSingleQueryParam(
        urlString,
        "d",
        false
    );
    if (legacyUriEncodedDeck != null) {
        // Check for legacy share link
        // Due to the old link containing illegal characters parseUrl causes issues
        return deckUriEncodingService.fromLegacyUrlQueryParamValue(
            legacyUriEncodedDeck,
            atob
        );
    }
    return Promise.resolve(null);
};

export default defineComponent({
    components: {
        BOverlay,
        YgoDeck,
        YgoBuilder,
        YgoToolbar,
    },
    props: {},
    setup: (props, context) => {
        const loaded = dataLoaded(context);

        const dragGroup = "GLOBAL_CARD_DRAG_GROUP";

        const canMoveInDeckParts = (e: any, oldDeckPart: DeckPart): boolean => {
            const target = e.relatedContext.component;
            const newDeckPart = findDeckPartForComponent(target);
            if (newDeckPart == null) {
                return false;
            }
            const deck = appStore(context).state.deck.active;
            const format = appStore(context).state.format.active;
            const card = e.draggedContext.element;

            return deckService.canMove(
                deck,
                oldDeckPart,
                newDeckPart,
                format,
                card
            );
        };

        const canMoveFromBuilder = (e: any): boolean => {
            const target = e.relatedContext.component;
            const newDeckPart = findDeckPartForComponent(target);
            if (newDeckPart == null) {
                return false;
            }
            const deck = appStore(context).state.deck.active;
            const format = appStore(context).state.format.active;
            const card = e.draggedContext.element;

            return deckService.canAdd(deck, newDeckPart, format, card);
        };

        cardDatabase
            .prepareAll()
            .catch((err) => {
                logger.error("Could not load data!", err);
                showError(context, "Could not load data!", "deck-tool__portal");
            })
            .then(() => {
                appStore(context).commit(DATA_LOADED);
                logger.info("Loaded data.");
                return loadUriDeck(location.toString());
            })
            .then((result) => {
                if (result != null) {
                    appStore(context).commit(DECK_REPLACE, { deck: result });
                    logger.info("Loaded deck from URI.");
                } else {
                    logger.info(
                        "No URI deck loaded, starting with empty deck."
                    );
                }
            })
            .catch((err) => {
                logger.error("Could not load deck!", err);
                showError(context, "Could not load deck!", "deck-tool__portal");
            });

        return {
            loaded,
            dragGroup,
            canMoveInDeckParts,
            canMoveFromBuilder,
        };
    },
});
</script>
<style lang="scss">
@import "../ui/src/styles/mixin/screen";
@import "../ui/src/styles/variables";

.deck-tool {
    .deck-tool__body {
        display: flex;
        flex-direction: column;

        &__primary {
            width: 100%;
        }

        &__secondary {
            width: 100%;
        }

        @include screen(min, md) {
            flex-direction: row;

            &__secondary {
                max-width: 340px;
                margin-left: $margin-lg;
            }
        }
    }
}
</style>
