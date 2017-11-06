<template>
    <div>
        <button class="btn btn-primary" title="Open Start Hand Simulation" v-b-modal.modalDrawSim>Simulate Start Hand</button>

        <!-- Modal Component -->
        <b-modal id="modalDrawSim" ref="modalDrawSim" hide-footer title="Start Hand Simulation">
            <p>Test</p>
            <button class="btn btn-primary" @click="hideModal">Close</button>
        </b-modal>
    </div>
</template>

<script>
import bModal from "bootstrap-vue/es/components/modal/modal";
import bModalDirective from "bootstrap-vue/es/directives/modal/modal";

export default {
  components: {
    bModal
  },
  directives: {
    bModal: bModalDirective
  },
  props: [],
  computed: {},
  methods: {
    showModal() {
      this.$refs.modalDrawSim.show();
    },
    hideModal() {
      this.$refs.modalDrawSim.hide();
    }
  }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "../styles/variables";
@import "../styles/variables.app";
</style>
