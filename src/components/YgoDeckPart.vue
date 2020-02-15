<template>
  <div :class="`deck-part-${deckPart.id}`" class="deck-part">
    <h3>{{ deckPart.name }} Deck ({{ deckPartList.length }} Cards):</h3>
    <template v-if="deckPartList.length">
      <ygo-price-view
        :item="deckPartList"
        :price-db="priceDb"
        v-if="ajax.pricesLoaded"
      />
      <div class="deck-content">
        <ygo-card
          :card-id="cardId"
          :card-name="cardDb.getName(cardId)"
          :key="`${cardId}_${cardIndex}`"
          @deckcardrightclick.prevent="deck.cardRemove(deckPart, cardId)"
          v-for="(cardId, cardIndex) in deckPartList"
        >
          <ygo-price-view
            :item="cardId"
            :price-db="priceDb"
            slot="price"
            v-if="ajax.pricesLoaded"
          />
        </ygo-card>
      </div>
    </template>
  </div>
</template>

<script>
import CardDb from "../lib/cardDb/CardDb";
import PriceDb from "../lib/priceDb/PriceDb";
import Deck from "../lib/deck/Deck";

import ygoCard from "./YgoCard.vue";
import ygoPriceView from "./YgoPriceView.vue";

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
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

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
