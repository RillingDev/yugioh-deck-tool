<template>
    <div class="main-deck">
 <!--        <h3>Decklist:</h3>
        <div class="deck" v-if="ajax.namesLoaded">
            <div class="deck-part deck-part-total" v-if="ajax.pricesLoaded">
                <div class="deck-title">
                    <h4>Total:</h4>
                    <div class="deck-price">
                        <span class="deck-price-item pricemode" v-for="mode in price.modes" v-bind:class="'pricemode-'+mode.id">{{priceForSection("*",mode.id)}}</span>
                    </div>
                </div>
            </div>
            <div class="deck-part" v-for="deckpart in deckparts" v-bind:class="'deck-part-'+deckpart.id">
                <div class="deck-title">
                    <h4>{{deckpart.name}} Deck ({{deck.list[deckpart.id].length}} Cards):</h4>
                    <div class="deck-price" v-if="ajax.pricesLoaded">
                        <span class="deck-price-item pricemode" v-for="mode in price.modes" v-bind:class="'pricemode-'+mode.id">{{priceForSection(deckpart.id,mode.id)}}</span>
                    </div>
                </div>
                <div class="deck-content" v-if="cards.data">
                    <a class="deck-card" target="_blank" v-for="cardId in deck.list[deckpart.id]" v-if="cards.data[cardId]" v-bind:href="cards.data[cardId].link"
                        @contextmenu.prevent="builderDeckRemove(cardId,deckpart.id)">
                        <div class="deck-card-image">
                            <img width="100" height="144" v-bind:src="cards.data[cardId].img">
                        </div>
                        <div class="deck-card-text">
                            <div class="deck-card-name">{{cards.data[cardId].name}}</div>
                            <div class="deck-price deck-price--sm" v-if="ajax.pricesLoaded">
                                <span class="deck-price-item pricemode" v-for="mode in price.modes" v-bind:class="'pricemode-'+mode.id">{{priceForCard(cardId,mode.id)}}</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
/*import priceConvert from "./lib/priceConvert";
import priceForCard from "./lib/priceForCard";
import priceForSection from "./lib/priceForSection"; */
export default {
  props: ["cards", "deckparts", "deck", "price", "ajax"],
  data: () => {
    return {};
  },
  computed: {}
};
</script>

<style lang="scss">

</style>
