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
                >a</b-modal>
                    </div>
</template>

<script>
import CardDatabase from "../lib/classes/cardDatabase";
import randomizeDeck from "../lib/randomizeDeck";
import { DECKPARTS } from "../lib/data/deck";

import bModal from "bootstrap-vue/es/components/modal/modal";

export default {
    components: { bModal },
    props: {
        cardDb: {
            type: CardDatabase,
            required: true
        }
    },
    methods: {
        showModal() {
            this.$refs.modalRandomizerSettings.show();
        },
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
