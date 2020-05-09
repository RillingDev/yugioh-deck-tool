<template>
    <div class="btn-group">
        <button
            class="btn btn-primary btn-sm"
            title="Sort Deck"
            v-on:click="() => sort()"
        >
            Sort
        </button>
        <button
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
import Component from "vue-class-component";
import { DECK_SHUFFLE, DECK_SORT } from "@/store/modules/deck";

@Component({})
export default class YgoSorter extends Vue {
    sort() {
        this.$store.commit(DECK_SORT);
    }

    shuffle() {
        this.$store.commit(DECK_SHUFFLE);
    }
}
</script>
