<template>
    <div class="deck">
        <div class="deck-part deck-part-total">
            <span>Total:</span>
            <ygo-price-view :cards="allCards" :group="true" />
        </div>
        <ygo-deck-part
            :class="`deck-part-${deckPart.id}`"
            :deck-part="deckPart"
            :key="deckPart.id"
            v-for="deckPart in deckParts"
            v-on:deck-card-right-click="
                (e, card) => onDeckCardRightClicked(card, { card, deckPart })
            "
        />
    </div>
</template>
<script lang="ts">
import YgoDeckPart from "./YgoDeckPart.vue";
import YgoPriceView from "./YgoPrice.vue";
import {
    Card,
    Deck,
    DeckService,
    DEFAULT_DECK_PART_ARR,
} from "yugioh-deck-tool-core/src/main";
import Component from "vue-class-component";
import Vue from "vue";
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";
import { DECK_CARD_REMOVE } from "@/store/modules/deck";

@Component({
    components: {
        YgoDeckPart,
        YgoPriceView,
    },
})
export default class YgoDeck extends Vue {
    deckParts = DEFAULT_DECK_PART_ARR;
    private readonly deckService = applicationContainer.get<DeckService>(
        APPLICATION_TYPES.DeckService
    );

    get allCards() {
        return this.deckService.getAllCards(this.deck);
    }

    get deck(): Deck {
        return this.$store.state.deck.active;
    }

    onDeckCardRightClicked(
        e: any,
        { card, deckPart }: { card: Card; deckPart }
    ) {
        this.$store.commit(DECK_CARD_REMOVE, { card, deckPart });
    }
}
</script>
