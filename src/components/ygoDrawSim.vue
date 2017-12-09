<template>
    <div>
        <button
            class="btn btn-primary btn-sm"
            title="Open Start Hand Simulation"
            @click="showModal()"
        >Start Hand</button>

        <b-modal
            id="modalDrawSim"
            ref="modalDrawSim"
            size="lg"
            hide-footer
            title="Start Hand Simulation"
        >
            <div class="drawsim">
                <div
                    class="btn-group"
                    role="group"
                >
                    <button
                        type="button button-primary"
                        class="btn btn-secondary"
                        :class="{active: drawMode === 5}"
                        @click="setDrawMode(5)"
                    >Going First</button>
                    <button
                        type="button button-primary"
                        class="btn btn-secondary"
                        :class="{active: drawMode === 6}"
                        @click="setDrawMode(6)"
                    >Going Second</button>
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
                    @click="draw()"
                    title="Simulate a new Starting Hand"
                >Draw</button>
            </div>
        </b-modal>
    </div>
</template>

<script>
import bModal from "bootstrap-vue/es/components/modal/modal";
import ygoCard from "./ygoCard.vue";

import simulateStartingHand from "../lib/simulateStartingHand";

export default {
    components: {
        bModal,
        ygoCard
    },
    props: {
        deckListMain: {
            type: Array,
            required: true,
            default: () => []
        },
        cardDb: {
            type: Object,
            required: true,
            default: () => {
                return {};
            }
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
            this.drawItems = simulateStartingHand(
                this.deckListMain,
                this.drawMode
            );
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
    flex-wrap: wrap;
    justify-content: center;
}
</style>
