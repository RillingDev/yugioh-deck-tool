<template>
    <div>
        <button class="btn btn-primary btn-sm" title="Open Start Hand Simulation" v-b-modal.modalDrawSim>Start Hand</button>

        <b-modal id="modalDrawSim" ref="modalDrawSim" size="lg" hide-footer  title="Start Hand Simulation">
            <div class="drawsim">
                <div class="drawsim-drawmode btn-group" role="group">
                    <button
                        type="button button-primary"
                        class="btn btn-secondary"
                        :class="{active: drawMode==='first'}"
                        @click="drawMode='first'"
                    >Going First</button>
                    <button
                        type="button button-primary"
                        class="btn btn-secondary"
                        :class="{active: drawMode==='second'}"
                        @click="drawMode='second'"
                    >Going Second</button>
                </div>
                <div class="drawsim-output">
                    <ygo-card
                        v-for="(drawItemId, index) of drawItems"
                        :key="`${drawItemId}_${index}`"
                        :card-id="drawItemId"
                        :card-name="cardsData.get(drawItemId)"
                        :on-right-click="()=>{}"
                    ></ygo-card>
                </div>
                <button class="btn btn-primary" @click="draw()">Draw</button>
            </div>
        </b-modal>
    </div>
</template>

<script>
import bModal from "bootstrap-vue/es/components/modal/modal";
import bModalDirective from "bootstrap-vue/es/directives/modal/modal";
import YgoCard from "./YgoCard.vue";

import simulateStartingHand from "../lib/simulateStartingHand";

export default {
  components: {
    bModal,
    YgoCard
  },
  directives: {
    bModal: bModalDirective
  },
  props: ["deckListMain", "cardsData"],
  data() {
    return {
      drawMode: "first",
      drawItems: []
    };
  },
  methods: {
    showModal() {
      this.$refs.modalDrawSim.show();
    },
    hideModal() {
      this.$refs.modalDrawSim.hide();
    },
    draw() {
      const cardAmount = this.drawMode === "first" ? 5 : 6;

      this.drawItems = simulateStartingHand(this.deckListMain, cardAmount);
      console.log(this.drawItems);
    }
  }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "../styles/variables";
@import "../styles/variables.app";

.priceapp {
  .close {
    margin: 0;
    padding: 0;
    font-size: 1.4em;
    cursor: pointer;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-title {
    margin-bottom: 0;
  }
}

.drawsim {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
}
.drawsim-output {
  margin: 1em 0;
  display: flex;
}
</style>
