<template>
  <div class="drawsim">
    <button
      :disabled="deckListMain.length === 0"
      class="btn btn-primary btn-sm"
      title="Open Start-Hand Simulation"
      @click="showModal"
    >
      Start-Hand
    </button>

    <b-modal
      id="modalDrawSim"
      ref="modalDrawSim"
      size="lg"
      hide-footer
      title="Start-Hand Simulation"
    >
      <div class="btn-group" role="group">
        <button
          :class="{ active: drawMode === 5 }"
          class="btn btn-primary"
          @click="setDrawMode(5)"
        >
          Going First
        </button>
        <button
          :class="{ active: drawMode === 6 }"
          class="btn btn-primary"
          @click="setDrawMode(6)"
        >
          Going Second
        </button>
      </div>
      <div class="drawsim-output">
        <ygo-card
          v-for="(drawItemId, index) of drawItems"
          :key="`${drawItemId}_${index}`"
          :card-id="drawItemId"
          :card-name="cardDb.getName(drawItemId)"
        />
      </div>
      <button
        class="btn btn-primary"
        title="Simulate a new Starting-Hand"
        @click="draw"
      >
        Draw
      </button>
    </b-modal>
  </div>
</template>

<script>
import ygoCard from "./ygoCard.vue";

import startHand from "../lib/deck/startHand";
import CardDb from "../lib/cardDb/cardDb";

export default {
  components: {
    ygoCard
  },
  props: {
    deckListMain: {
      type: Array,
      required: true
    },
    cardDb: {
      type: CardDb,
      required: true
    }
  },
  data() {
    return {
      drawMode: 5,
      drawItems: []
    };
  },
  methods: {
    showModal() {
      this.$refs.modalDrawSim.show();
      this.draw();
    },
    setDrawMode(newMode) {
      this.drawMode = newMode;
      this.draw();
    },
    draw() {
      this.drawItems = startHand(this.deckListMain, this.drawMode);
    }
  }
};
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../styles/variables.custom";

@import "~bootstrap/scss/button-group";
@import "~bootstrap/scss/close";
@import "~bootstrap/scss/modal";

.drawsim-output {
  margin: 1em 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
