<template>
    <BOverlay :show="!loaded">
        <div class="deck-tool__body">
            <div class="deck-tool__body__primary">
                <YgoToolbar />
                <hr />
                <YgoDeck :drag-group="dragGroup" v-show="loaded" />
            </div>
            <div class="deck-tool__body__secondary">
                <YgoBuilder :drag-group="dragGroup" />
            </div>
        </div>
    </BOverlay>
</template>

<script lang="ts">
import type { CardDatabase } from "../../core/src/main";
import { getLogger } from "../../core/src/main";
import { applicationContainer } from "./inversify.config";
import { APPLICATION_TYPES } from "./types";
import { DECK_REPLACE } from "./store/modules/deck";
import { defineComponent } from "@vue/composition-api";
import { DATA_LOADED } from "./store/modules/data";
import { BOverlay } from "bootstrap-vue";
import { appStore } from "./composition/state/appStore";
import { dataLoaded } from "./composition/state/dataLoaded";
import { showError } from "./composition/feedback";
import YgoDeck from "./components/deck/YgoDeck.vue";
import YgoBuilder from "./components/builder/YgoBuilder.vue";
import YgoToolbar from "./components/toolbar/YgoToolbar.vue";
import type { DeckUrlController } from "./controller/DeckUrlController";

const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);
const deckUrlController = applicationContainer.get<DeckUrlController>(
    APPLICATION_TYPES.DeckUrlController
);

const logger = getLogger("App");

export default defineComponent({
    components: {
        BOverlay,
        YgoDeck,
        YgoBuilder,
        YgoToolbar,
    },
    props: {},
    setup(props, context) {
        const loaded = dataLoaded(context);

        const dragGroup = "GLOBAL_CARD_DRAG_GROUP";

        cardDatabase
            .prepareAll()
            .catch((err) => {
                logger.error("Could not load data!", err);
                showError(context, "Could not load data!", "deck-tool__portal");
            })
            .then(() => {
                appStore(context).commit(DATA_LOADED);
                logger.info("Loaded data.");
                return deckUrlController.loadUriDeck(location.toString());
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
        };
    },
});
</script>
<style lang="scss">
@import "../ui/src/styles/mixins";
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

        @include screen-min-width(md) {
            flex-direction: row;

            &__secondary {
                max-width: 340px;
                margin-left: $margin-lg;
            }
        }
    }
}
</style>
