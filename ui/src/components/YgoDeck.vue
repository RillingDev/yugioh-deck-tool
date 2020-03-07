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

import YgoDeckPart from "./YgoDeckPart.vue";
import YgoPriceView from "./YgoPriceView.vue";
import { DEFAULT_DECKPART_ARR } from "../../../core";
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component({
    components: {
        YgoDeckPart,
        YgoPriceView
    }
})
export default class YgoDeck extends Vue {
    @Prop({ required: true })
    public deck: Deck;

    public deckParts = DEFAULT_DECKPART_ARR;
}
</script>
