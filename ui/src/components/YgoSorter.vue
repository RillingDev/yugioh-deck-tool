<template>
    <div class="sorter">
        <button
            :disabled="deckService.getAllCards(this.deck).length < 2"
            v-on:click="() => sort()"
            class="btn btn-primary btn-sm"
            title="Sort Deck"
        >
            Sort Deck
        </button>
        <button
            :disabled="deckService.getAllCards(this.deck).length < 2"
            v-on:click="() => shuffle()"
            class="btn btn-primary btn-sm"
            title="Shuffle Deck"
        >
            Shuffle Deck
        </button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { Deck, DeckService } from "../../../core/src/main";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import Component from "vue-class-component";

@Component({})
export default class YgoSorter extends Vue {
    @Prop({ required: true })
    deck: Deck;

    private readonly deckService = uiContainer.get<DeckService>(
        UI_TYPES.DeckService
    );

    sort() {
        this.deck.parts = this.deckService.sort(this.deck).parts;
    }
    shuffle() {
        this.deck.parts = this.deckService.shuffle(this.deck).parts;
    }
}
</script>
