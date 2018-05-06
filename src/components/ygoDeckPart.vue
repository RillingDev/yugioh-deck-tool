<template>
    <div
        :class="`deck-part-${deckPart.id}`"
        class="deck-part"
    >
        <h3>{{ deckPart.name }} Deck ({{ deckPartList.length }} Cards):</h3>
        <template v-if="deckPartList.length">
            <ygo-price-view
                v-if="ajax.pricesLoaded"
                :item="deckPartList"
                :price-db="priceDb"
            />
            <div class="deck-content">
                <ygo-card
                    v-for="(cardId, cardIndex) in deckPartList"
                    :key="`${cardId}_${cardIndex}`"
                    :card-id="cardId"
                    :card-name="cardDb.getName(cardId)"
                    @deckcardrightclick.prevent="deck.cardRemove(deckPart, cardId)"
                >
                    <ygo-price-view
                        v-if="ajax.pricesLoaded"
                        slot="price"
                        :item="cardId"
                        :price-db="priceDb"
                    />
                </ygo-card>
            </div>
        </template>
    </div>
</template>

<script>
import CardDb from "../lib/cardDb/cardDb";
import PriceDb from "../lib/priceDb/priceDb";
import Deck from "../lib/deck/deck";

import ygoCard from "./ygoCard.vue";
import ygoPriceView from "./ygoPriceView.vue";

export default {
    components: {
        ygoCard,
        ygoPriceView
    },
    props: {
        ajax: {
            type: Object,
            required: true
        },
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
        },
        cardDb: {
            type: CardDb,
            required: true
        },
        priceDb: {
            type: PriceDb,
            required: true
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/mixins";
@import "node_modules/bootstrap/scss/variables";

@import "../styles/variables.custom";

.deck-content {
    padding: 4px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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
