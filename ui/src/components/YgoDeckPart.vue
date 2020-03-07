<template>
    <div :class="`deck-part-${deckPart.id}`" class="deck-part">
        <h3>
            {{ deckPart.name }} Deck ({{ deck.parts.get(deckPart).length }}
            Cards):
        </h3>
        <template v-if="deck.parts.get(deckPart).length > 0">
            <ygo-price-view :cards="deck.parts.get(deckPart)" />
            <div class="deck-content">
                <ygo-card
                    :card="card"
                    :key="`${card.id}_${cardIndex}`"
                    @deckcardrightclick.prevent="
                        deckService.removeCard(deck, deckPart, card)
                    "
                    v-for="(card, cardIndex) in deck.parts.get(deckPart)"
                >
                    <ygo-price-view :cards="[card]" slot="price" />
                </ygo-card>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import YgoCard from "./YgoCard.vue";
import YgoPriceView from "./YgoPriceView.vue";
import { CardDatabase, Deck, DeckPart, DeckService } from "../../../core";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
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

    cardDatabase = uiContainer.get<CardDatabase>(UI_TYPES.CardDatabase);
    deckService = uiContainer.get<DeckService>(UI_TYPES.DeckService);
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
