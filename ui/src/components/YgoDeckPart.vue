<template>
    <div :class="`deck-part-${deckPart.id}`" class="deck-part">
        <h3>{{ deckPart.name }} Deck ({{ deckPartList.length }} Cards):</h3>
        <template v-if="deckPartList.length">
            <ygo-price-view :item="deckPartList" />
            <div class="deck-content">
                <ygo-card
                    :card="cardDatabase.getCard(cardId)"
                    :key="`${cardId}_${cardIndex}`"
                    @deckcardrightclick.prevent="
                        deck.cardRemove(deckPart, cardId)
                    "
                    v-for="(cardId, cardIndex) in deckPartList"
                >
                    <ygo-price-view :item="cardId" slot="price" />
                </ygo-card>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import Deck from "../lib/deck/Deck";

import ygoCard from "./YgoCard.vue";
import ygoPriceView from "./YgoPriceView.vue";
import { CardDatabase } from "../../../core";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";

export default {
    components: {
        ygoCard,
        ygoPriceView
    },
    props: {
        deck: {
            type: Deck,
            required: true
        },
        deckPart: {
            type: Object,
            required: true
        },
        deckPartList: {
            type: Array,
            required: true
        }
    },
    data: () => {
        return {
            cardDatabase: uiContainer.get<CardDatabase>(UI_TYPES.CardDatabase)
        };
    }
};
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../styles/variables.custom";

.deck-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 4px;
}

.deck-part {
    margin-bottom: 1.25em;

    h3 {
        font-size: 1rem;
        display: initial;
    }

    &-main {
        .deck-content {
            background-color: $color-deckpart-main;
        }
    }

    &-extra {
        .deck-content {
            background-color: $color-deckpart-extra;
        }
    }

    &-side {
        .deck-content {
            background-color: $color-deckpart-side;
        }
    }
}
</style>
