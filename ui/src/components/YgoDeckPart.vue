<template>
    <div :class="`deck-part-${deckPart.id}`" class="deck-part">
        <h3>
            {{ deckPart.name }} Deck ({{ cards.length }}
            Cards):
        </h3>
        <ygo-price-view :cards="cards" :group="true" />
        <div class="deck-content" v-if="cards.length > 0">
            <ygo-card
                :card="card"
                :key="`${card.id}_${cardIndex}`"
                v-for="(card, cardIndex) in cards"
                v-on:deck-card-right-click="() => onDeckCardRightClicked(card)"
            >
            </ygo-card>
        </div>
    </div>
</template>

<script lang="ts">
import YgoCard from "./YgoCard.vue";
import YgoPriceView from "./YgoPriceView.vue";
import { Card, Deck, DeckPart } from "../../../core/src/main";
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component({
    components: {
        YgoCard,
        YgoPriceView
    }
})
export default class YgoDeckPart extends Vue {
    @Prop({ required: true })
    deck: Deck;
    @Prop({ required: true })
    deckPart: DeckPart;

    get cards() {
        return this.deck.parts.get(this.deckPart);
    }

    onDeckCardRightClicked(card: Card) {
        this.$emit("deck-card-right-click", card);
    }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../styles/variables.custom";

.deck-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 4px;
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
