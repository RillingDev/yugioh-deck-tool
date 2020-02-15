<template>
  <div class="deck">
    <div v-if="ajax.pricesLoaded" class="deck-part deck-part-total">
      <span>Total:</span>
      <ygo-price-view :item="deck.all" :price-db="priceDb" />
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
import CardDb from "../lib/cardDb/cardDb";
import PriceDb from "../lib/priceDb/priceDb";
import Deck from "../lib/deck/deck";

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
