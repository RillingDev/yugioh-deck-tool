<template>
    <div class="randomizer">
        <button
            class="btn btn-primary btn-sm"
            title="Open Randomizer"
            @click="randomize"
        >Randomize</button>
    </div>
</template>

<script>
import randomizeDeck from "../lib/randomizeDeck";
import { DECKPARTS } from "../lib/data/deck";

export default {
    props: {
        pairsArr: {
            type: Array,
            required: true
        },
        deckCardCanAdd: {
            type: Function,
            required: true
        }
    },
    methods: {
        randomize() {
            const result = randomizeDeck(
                this.pairsArr,
                DECKPARTS,
                this.deckCardCanAdd
            );

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
