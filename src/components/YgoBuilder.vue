<template>
    <div class="builder">
        <p>Showing {{pairsFiltered.length}} of {{pairs.length}} Cards</p>
        <input class="form-control builder-search" type="search" title="Search" placeholder="Search" v-model="filter">
         <ul class="builder-list">
            <li class="builder-card" v-for="pair in pairsFiltered" :key="pair[0]">
                <div class="builder-card-action">
                    <div class="fa fa-plus builder-add"
                        v-for="deckpart in deckparts"
                        :key="deckpart.id"
                        :class="`builder-add-${deckpart.id}`"
                        :title="`Add Card to ${deckpart.name} Deck`"
                        @click="deckCardAdd(deckpart,pair[0])"
                    ></div>
                </div>
                <div class="builder-card-name">{{pair[1]}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
/* import builderUpdateNames from "./lib/builderUpdateNames";
import builderDeckAdd from "./lib/builderDeckAdd";
import builderDeckRemove from "./lib/builderDeckRemove"; */
import { arrClone } from "lightdash";

export default {
  props: ["pairsMap", "deckparts", "deckCardAdd"],
  data: () => {
    return {
      filter: ""
    };
  },
  computed: {
    pairs() {
      return arrClone(this.pairsMap.entries());
    },
    pairsFiltered() {
      return this.pairs
        .filter(pair => pair[1].includes(this.filter))
        .slice(0, 100);
    }
  }
};
</script>

<style lang="scss">

</style>
