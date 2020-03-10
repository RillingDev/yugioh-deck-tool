import { SortingStrategy } from
"../../../core/src/core/business/SortingService.js";
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
                    class="btn btn-primary"
                    v-on:click="() => setDrawMode(5)"
                >
                    Going First
                </button>
                <button
                    :class="{ active: drawMode === 6 }"
                    class="btn btn-primary"
                    v-on:click="() => setDrawMode(6)"
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
        </b-modal>
    </div>
</template>

<script lang="ts">
import YgoCard from "./YgoCard.vue";

import Component from "vue-class-component";
import Vue from "vue";
import { Card, Deck, DefaultDeckPart } from "../../../core/src/main";
import { BModal } from "bootstrap-vue";
import { Prop } from "vue-property-decorator";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import {
    SortingService,
    SortingStrategy
} from "../../../core/src/core/business/SortingService";

@Component({ components: { YgoCard, BModal } })
export default class YgoDrawSim extends Vue {
    @Prop({ required: true })
    deck: Deck;

    drawMode = 5;
    drawItems: Card[] = [];

    private readonly sortingService = uiContainer.get<SortingService>(
        UI_TYPES.SortingService
    );

    get mainDeckCards() {
        return this.deck.parts.get(DefaultDeckPart.MAIN);
    }

    showModal() {
        (this.$refs.modalDrawSim as BModal).show();
        this.draw();
    }

    setDrawMode(newMode) {
        this.drawMode = newMode;
        this.draw();
    }

    draw() {
        this.drawItems = this.sortingService
            .sort(this.mainDeckCards, SortingStrategy.SHUFFLE)
            .slice(0, this.drawMode);
    }
}
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
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 1em 0;
}
</style>
