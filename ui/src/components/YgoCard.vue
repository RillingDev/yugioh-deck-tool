<template>
    <a
        :data-name="card.name"
        :href="referenceUrl"
        class="deck-card"
        target="_blank"
        v-on:contextmenu="onDeckCardRightClicked"
    >
        <img :alt="card.name" :src="imageUrl" height="135" width="100" />
        <div class="deck-card-text">
            <span class="deck-card-name">{{ card.name }}</span>
            <ygo-price-view :cards="[card]" />
        </div>
    </a>
</template>

<script lang="ts">
import { URL_DB_API, URL_IMAGE_UNKNOWN } from "../lib/data/urls";
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { Card } from "../../../core";
import YgoPriceView from "@/components/YgoPriceView.vue";

const NAME_UNKNOWN = "Unknown";

@Component({
    components: {
        YgoPriceView
    }
})
export default class YgoCard extends Vue {
    @Prop({ required: true })
    public card: Card;

    get imageUrl() {
        return this.card.image?.urlSmall ?? URL_IMAGE_UNKNOWN;
    }

    get referenceUrl() {
        if (this.card.name === NAME_UNKNOWN) {
            return URL_DB_API;
        }
        return URL_DB_API + encodeURI(this.card.name);
    }

    onDeckCardRightClicked(e: Event) {
        e.preventDefault();
        this.$emit("deck-card-right-click");
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
}

.deck-card-text {
    font-size: 0.85em;
    line-height: 1.125em;
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 6px;
    transition: opacity 0.15s;
    text-align: center;
    word-wrap: break-word;
    opacity: 0;
    color: $gray-800;
    background-color: $gray-200;

    &:focus,
    &:hover {
        opacity: 1;
    }
}
</style>
