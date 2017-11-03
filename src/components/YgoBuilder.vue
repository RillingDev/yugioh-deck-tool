<template>
    <div class="main-builder">
        <!-- <h3>Deckbuilder:</h3>
        <div class="builder">
            <p>Showing {{builder.pairsFiltered.length}} of {{cards.pairs.length}} Cards</p>
            <div class="form">
                <input class="form-control builder-search" id="builderSearch" type="text" title="Search Query" placeholder="Search" v-model="builder.filter"
                    @input="builderUpdateNames()">
            </div>
            <ul class="builder-list">
                <li class="builder-card" v-for="card in builder.pairsFiltered">
                    <div class="builder-card-action">
                        <div class="fa fa-plus deck-part" v-for="deckpart in deckparts" v-bind:class="'deck-part-'+deckpart.id" @click="builderDeckAdd(card[0],deckpart.id)"
                            v-bind:title="'Add Card to '+deckpart.name+' Deck'"></div>
                    </div>
                    <div class="builder-card-name">{{card[1]}}</div>
                </li>
            </ul>
            <div class="builder-description">
                <p>- Use the pluses to add a card.</p>
                <p>- Right-click a card in the deck to remove it.</p>
            </div>
        </div> -->
    </div>
</template>

<script>
/* import builderUpdateNames from "./lib/builderUpdateNames";
import builderDeckAdd from "./lib/builderDeckAdd";
import builderDeckRemove from "./lib/builderDeckRemove"; */

export default {
  props: ["cards", "deckparts", "deck", "builder", "ajax"],
  data: () => {
    return {
      filter: "",
      pairsFiltered: []
    };
  },
  computed: {}
};
</script>

<style lang="scss">

</style>
