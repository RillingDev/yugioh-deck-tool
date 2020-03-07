<template>
    <div class="sorter">
        <button
            :disabled="deck.getAll().length < 2"
            @click="deck.sort(cardDb)"
            class="btn btn-primary btn-sm"
            title="Sort Deck"
        >
            Sort Deck
        </button>
    </div>
</template>

<script lang="ts">
import Deck from "../lib/deck/Deck";

export default {
    props: {
        deck: {
            type: Deck,
            required: true
        },
        cardDatabase: {
            required: true
        }
    },
    data: function() {
        return {};
    }
};
</script>
