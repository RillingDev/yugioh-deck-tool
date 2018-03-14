<template>
    <div
        class="randomizer btn-group"
        role="group"
    >
        <button
            class="btn btn-primary btn-sm"
            title="Randomize Deck"
            @click="randomize"
        >Randomize</button>
        <button
            class="btn btn-primary btn-sm"
            title="Configure Randomizer"
            @click="showModal"
        >
            <span class="fa fa-gear">
                <!---->
            </span>
        </button>
        <b-modal
            id="modalRandomizerSettings"
            ref="modalRandomizerSettings"
            size="lg"
            hide-footer
            title="Randomizer Settings"
        >
            <div class="form-group">
                <label>Mode:</label>
                <select
                    v-model="mode.selected"
                    class="form-control"
                >
                    <option
                        v-for="modeCurrent in mode.available"
                        :key="modeCurrent.name"
                        :value="modeCurrent"
                    >{{ modeCurrent.name }}</option>
                </select>
            </div>
        </b-modal>
    </div>
</template>

<script>
import CardDatabase from "../lib/classes/cardDatabase";
import randomizeDeck from "../lib/randomizeDeck";
import { RANDOMIZER_MODES } from "../lib/data/randomizer";

import bModal from "bootstrap-vue/es/components/modal/modal";

export default {
    components: { bModal },
    props: {
        cardDb: {
            type: CardDatabase,
            required: true
        }
    },
    data: () => {
        return {
            mode: {
                selected: RANDOMIZER_MODES[0],
                available: RANDOMIZER_MODES
            }
        };
    },
    methods: {
        showModal() {
            this.$refs.modalRandomizerSettings.show();
        },
        randomize() {
            const filter = this.mode.selected.filterFactory();
            const result = randomizeDeck(this.cardDb, filter);

            this.$emit("randomize", result);
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/mixins";
@import "node_modules/bootstrap/scss/variables";

@import "../styles/variables.custom";
</style>
