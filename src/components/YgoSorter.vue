<template>
  <div class="sorter">
    <button
      :disabled="deck.all.length < 2"
      @click="deck.sort(cardDb)"
      class="btn btn-primary btn-sm"
      title="Sort Deck"
    >
      Sort Deck
    </button>
  </div>
</template>

<script>
import CardDb from "../lib/cardDb/CardDb";
import Deck from "../lib/deck/Deck";

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
