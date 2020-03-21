<template>
    <div class="sorter">
        <button
            class="btn btn-primary btn-sm"
            title="Sort Deck"
            v-on:click="() => randomize()"
        >
            Randomize
        </button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { Deck, DeckRandomizationService } from "../../../core/src/main";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import Component from "vue-class-component";
import { RandomizationStrategy } from "../../../core/src/core/business/service/DeckRandomizationService";

@Component({})
export default class YgoRandomizer extends Vue {
    @Prop({ required: true })
    deck: Deck;

    private readonly deckRandomizationService = uiContainer.get<
        DeckRandomizationService
    >(UI_TYPES.DeckRandomizationService);

    randomize() {
        const randomizedDeck = this.deckRandomizationService.randomize(
            RandomizationStrategy.NORMAL
        );
        this.deck.parts = randomizedDeck.parts;
        this.deck.name = randomizedDeck.name;
    }
}
</script>
