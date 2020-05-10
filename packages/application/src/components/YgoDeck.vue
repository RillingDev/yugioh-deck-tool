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
            @card-right-click="(e) => onDeckCardRightClicked(e, deckPart)"
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
    DeckPart,
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

    onDeckCardRightClicked(e: { card: Card }, deckPart: DeckPart) {
        // eslint-disable-next-line prefer-rest-params
        console.log(arguments);
        this.$store.commit(DECK_CARD_REMOVE, {
            card: e.card,
            deckPart: deckPart,
        });
    }
}
</script>
