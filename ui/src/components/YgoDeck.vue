<template>
    <div class="deck">
        <div class="deck-part deck-part-total">
            <span>Total:</span>
            <ygo-price-view :item="deck.all" :price-db="priceDb" />
        </div>
        <ygo-deck-part
            :card-db="cardDb"
            :class="`deck-part-${deckPart.id}`"
            :deck="deck"
            :deck-part="deckPart"
            :deck-part-list="deck[deckPart.id]"
            :key="deckPart.id"
            :price-db="priceDb"
            v-for="deckPart in deck.parts"
        />
    </div>
</template>
<script lang="ts">
import CardDb from "../lib/cardDb/CardDatabase";
import PriceDb from "../lib/priceDb/PriceDatabase";
import Deck from "../lib/deck/Deck";

import ygoDeckPart from "./YgoDeckPart.vue";
import ygoPriceView from "./YgoPriceView.vue";

export default {
    components: {
        ygoDeckPart,
        ygoPriceView
    },
    props: {
        deck: {
            type: Deck,
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
