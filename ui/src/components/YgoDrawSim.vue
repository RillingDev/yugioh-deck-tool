<template>
    <div class="drawsim">
        <button
            :disabled="deckListMain.length === 0"
            @click="showModal"
            class="btn btn-primary btn-sm"
            title="Open Start-Hand Simulation"
        >
            Start-Hand
        </button>

        <b-modal
            hide-footer
            id="modalDrawSim"
            ref="modalDrawSim"
            size="lg"
            title="Start-Hand Simulation"
        >
            <div class="btn-group" role="group">
                <button
                    :class="{ active: drawMode === 5 }"
                    @click="setDrawMode(5)"
                    class="btn btn-primary"
                >
                    Going First
                </button>
                <button
                    :class="{ active: drawMode === 6 }"
                    @click="setDrawMode(6)"
                    class="btn btn-primary"
                >
                    Going Second
                </button>
            </div>
            <div class="drawsim-output">
                <ygo-card
                    :card="cardDb.get(drawItemId)"
                    :key="`${drawItemId}_${index}`"
                    v-for="(drawItemId, index) of drawItems"
                />
            </div>
            <button
                @click="draw"
                class="btn btn-primary"
                title="Simulate a new Starting-Hand"
            >
                Draw
            </button>
        </b-modal>
    </div>
</template>

<script>
import ygoCard from "./YgoCard.vue";

import startHand from "../lib/deck/startHand";
import CardDb from "../lib/cardDb/CardDatabase";

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
