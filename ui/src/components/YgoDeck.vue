<template>
    <div class="deck">
        <div class="deck-part deck-part-total">
            <span>Total:</span>
            <ygo-price-view :cards="allCards" :group="true" />
        </div>
        <ygo-deck-part
            :class="`deck-part-${deckPart.id}`"
            :deck="deck"
            :deck-part="deckPart"
            :key="deckPart.id"
            v-for="deckPart in deckParts"
            v-on:deck-card-right-click="
                card => onDeckCardRightClicked(card, deckPart)
            "
        />
    </div>
</template>
<script lang="ts">
import YgoDeckPart from "./YgoDeckPart.vue";
import YgoPriceView from "./YgoPriceView.vue";
import {
    Card,
    Deck,
    DeckService,
    DEFAULT_DECKPART_ARR
} from "../../../core/src/main";
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";

@Component({
    components: {
        YgoDeckPart,
        YgoPriceView
    }
})
export default class YgoDeck extends Vue {
    @Prop({ required: true })
    deck: Deck;
    deckParts = DEFAULT_DECKPART_ARR;
    private readonly deckService = uiContainer.get<DeckService>(
        UI_TYPES.DeckService
    );

    get allCards() {
        return this.deckService.getAllCards(this.deck);
    }

    onDeckCardRightClicked(card: Card, deckPart) {
        this.deckService.removeCard(this.deck, deckPart, card);
    }
}
</script>
