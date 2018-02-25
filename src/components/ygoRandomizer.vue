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
import CardDatabase from "../lib/classes/cardDatabase";
import randomizeDeck from "../lib/randomizeDeck";
import { DECKPARTS } from "../lib/data/deck";

export default {
    props: {
        cardDb: {
            type: CardDatabase,
            required: true
        }
    },
    methods: {
        randomize() {
            const result = randomizeDeck(this.cardDb, DECKPARTS);

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
