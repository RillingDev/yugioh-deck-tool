<template>
    <div class="deck">
        <div
            class="deck-part deck-part-total"
            v-if="ajax.pricesLoaded"
        >
            <span>Total:</span>
            <ygo-price-view
                :item="deck.all"
                :price-db="priceDb"
            />
        </div>
        <ygo-deck-part
            v-for="deckPart in deck.parts"
            :key="deckPart.id"
            :class="`deck-part-${deckPart.id}`"
            :ajax="ajax"
            :deck="deck"
            :deck-part="deckPart"
            :deck-part-list="deck[deckPart.id]"
            :card-db="cardDb"
            :price-db="priceDb"
        />
    </div>
</template>

<script>
import CardDatabase from "../lib/classes/cardDatabase";
import PriceDatabase from "../lib/classes/priceDatabase";
import Deck from "../lib/classes/deck";

import ygoDeckPart from "./ygoDeckPart.vue";
import ygoPriceView from "./ygoPriceView.vue";

export default {
    components: {
        ygoDeckPart,
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
        cardDb: {
            type: CardDatabase,
            required: true
        },
        priceDb:{
            type: PriceDatabase,
            required: true
        }
    }
};
</script>
