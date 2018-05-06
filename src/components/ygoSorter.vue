<template>
    <div
        class="sorter"
    >
        <button
            :disabled="deck.all.length < 2"
            class="btn btn-primary btn-sm"
            title="Sort Deck"
            @click="deck.sort(cardDb)"
        >Sort Deck</button>
    </div>
</template>

<script>
import CardDatabase from "../lib/classes/cardDatabase";
import Deck from "../lib/classes/deck";

export default {
    props: {
        deck: {
            type: Deck,
            required: true
        },
        cardDb: {
            type: CardDatabase,
            required: true
        }
    },
    data: () => {}
};
</script>
