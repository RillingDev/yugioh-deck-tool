<template>
  <div class="deck">
    <div class="deck-part deck-part-total" v-if="ajax.pricesLoaded">
      <span>Total:</span>
      <ygo-price-view :item="deck.all" :price-db="priceDb" />
    </div>
    <ygo-deck-part
      :ajax="ajax"
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

<script>
import CardDb from "../lib/cardDb/CardDb";
import PriceDb from "../lib/priceDb/PriceDb";
import Deck from "../lib/deck/Deck";

import ygoDeckPart from "./YgoDeckPart.vue";
import ygoPriceView from "./YgoPriceView.vue";

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
