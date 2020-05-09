<template>
    <div class="btn-group">
        <button
            :disabled="deckService.getAllCards(this.deck).length < 2"
            class="btn btn-primary btn-sm"
            title="Sort Deck"
            v-on:click="() => sort()"
        >
            Sort
        </button>
        <button
            :disabled="deckService.getAllCards(this.deck).length < 2"
            class="btn btn-primary btn-sm"
            title="Shuffle Deck"
            v-on:click="() => shuffle()"
        >
            Shuffle
        </button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { Deck, DeckService } from "yugioh-deck-tool-core/src/main";
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";
import Component from "vue-class-component";

@Component({})
export default class YgoSorter extends Vue {
    @Prop({ required: true })
    deck: Deck;

    private readonly deckService = applicationContainer.get<DeckService>(
        APPLICATION_TYPES.DeckService
    );

    sort() {
        this.deck.parts = this.deckService.sort(this.deck).parts;
    }

    shuffle() {
        this.deck.parts = this.deckService.shuffle(this.deck).parts;
    }
}
</script>
