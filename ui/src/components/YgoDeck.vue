<template>
    <div class="deck">
        <div class="deck-part deck-part-total">
            <span>Total:</span>
            <ygo-price-view :item="deck.getAll()" />
        </div>
        <ygo-deck-part
            :class="`deck-part-${deckPart.id}`"
            :deck="deck"
            :deck-part="deckPart"
            :deck-part-list="deck[deckPart.id]"
            :key="deckPart.id"
            v-for="deckPart in deckParts"
        />
    </div>
</template>
<script lang="ts">
import Deck from "../lib/deck/Deck";

import ygoDeckPart from "./YgoDeckPart.vue";
import ygoPriceView from "./YgoPriceView.vue";
import { DEFAULT_DECKPART_ARR } from "../../../core";

export default {
    components: {
        ygoDeckPart,
        ygoPriceView
    },
    props: {
        deck: {
            type: Deck,
            required: true
        }
    },
    data: () => {
        return {
            deckParts: DEFAULT_DECKPART_ARR
        };
    }
};
</script>
