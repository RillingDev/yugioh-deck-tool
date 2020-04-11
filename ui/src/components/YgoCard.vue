<template>
    <a
        :data-name="card.name"
        href="#"
        class="deck-card"
        target="_blank"
        v-on:contextmenu="(e) => onDeckCardRightClicked(e)"
    >
        <img
            :alt="card.name"
            :src="card.image.urlSmall"
            height="135"
            width="100"
        />
    </a>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { Card } from "../../../core/src/main";
import YgoPriceView from "@/components/YgoPriceView.vue";

@Component({
    components: {
        YgoPriceView,
    },
})
export default class YgoCard extends Vue {
    @Prop({ required: true })
    public card: Card;
    onDeckCardRightClicked(e: Event) {
        e.preventDefault();
        this.$emit("deck-card-right-click", e);
    }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../styles/variables.custom";

.deck-card {
    position: relative;
    margin: 4px;
}

.deck-card img {
    margin-bottom: 0;
    pointer-events: none;
}
</style>
