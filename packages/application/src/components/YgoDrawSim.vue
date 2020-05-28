<template>
    <div class="drawsim">
        <button
            :disabled="mainDeckCards.length === 0"
            class="btn btn-primary btn-sm"
            title="Open Start-Hand Simulation"
            v-on:click="() => showModal()"
        >
            Start-Hand
        </button>

        <BModal
            hide-footer
            id="modalDrawSim"
            modal-class="deck-tool__modal"
            ref="modalDrawSim"
            size="lg"
            title="Start-Hand Simulation"
        >
            <div class="btn-group" role="group">
                <button
                    :class="{ active: goingFirst }"
                    class="btn btn-primary"
                    v-on:click="() => setGoingFirst(true)"
                >
                    Going First
                </button>
                <button
                    :class="{ active: !goingFirst }"
                    class="btn btn-primary"
                    v-on:click="() => setGoingFirst(false)"
                >
                    Going Second
                </button>
            </div>
            <div class="drawsim-output">
                <ygo-card
                    :card="drawItem"
                    :key="`${drawItem.id}_${index}`"
                    v-for="(drawItem, index) of drawItems"
                />
            </div>
            <button
                class="btn btn-primary"
                title="Simulate a new Starting-Hand"
                v-on:click="() => draw()"
            >
                Draw
            </button>
        </BModal>
    </div>
</template>

<script lang="ts">
import YgoCard from "./YgoCard.vue";

import Component from "vue-class-component";
import Vue from "vue";
import {
    Card,
    Deck,
    DeckService,
    DeckPart,
} from "yugioh-deck-tool-core/src/main";
import { BModal } from "bootstrap-vue";
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

@Component({ components: { YgoCard, BModal } })
export default class YgoDrawSim extends Vue {
    goingFirst = true;
    drawItems: Card[] = [];

    get mainDeckCards() {
        return this.deck.parts[DeckPart.MAIN];
    }

    get deck(): Deck {
        return this.$store.state.deck.active;
    }

    showModal() {
        (this.$refs.modalDrawSim as BModal).show();
        this.draw();
    }

    setGoingFirst(goingFirst) {
        this.goingFirst = goingFirst;
        this.draw();
    }

    draw() {
        this.drawItems = deckService.getSimulatedStartingHand(
            this.deck,
            this.goingFirst
        );
    }
}
</script>

<style lang="scss">
.drawsim-output {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 1em 0;
}
</style>
