<template>
  <div class="sorter">
    <button
      :disabled="deck.all.length < 2"
      class="btn btn-primary btn-sm"
      title="Sort Deck"
      @click="deck.sort(cardDb)"
    >
      Sort Deck
    </button>
  </div>
</template>

<script>
import CardDb from "../lib/cardDb/cardDb";
import Deck from "../lib/deck/deck";

export default {
  props: {
    deck: {
      type: Deck,
      required: true
    },
    cardDb: {
      type: CardDb,
      required: true
    }
  },
  data: function() {
    return {};
  }
};
</script>
