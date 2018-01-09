<template>
    <a
        class="deck-card"
        target="_blank"
        :href="link"
        :data-name="cardName"
        @contextmenu="contextEvent"
    >
        <img
            width="100"
            height="140"
            :src="image"
        >
        <div class="deck-card-text">
            <div class="deck-card-name">{{ cardName || `[${cardId}]` }}</div>
            <slot
                class="deck-card-price"
                name="price"
            />
        </div>
    </a>
</template>

<script>
import getUrls from "../lib/data/urls";
import { isDefined, isFunction } from "lightdash";

const urls = getUrls();

export default {
    props: {
        cardId: {
            type: String,
            required: true,
        },
        cardName: {
            type: String,
            required: false,
            default: ""
        }
    },
    computed: {
        hasData() {
            return isDefined(this.cardName);
        },
        image() {
            return this.hasData
                ? `${urls.imageAPI}/${this.cardId}.jpg`
                : urls.imageUnkown;
        },
        link() {
            return this.hasData
                ? `${urls.buyAPI}${encodeURI(this.cardName.replace(/ /g, "+"))}`
                : `http://yugioh.wikia.com/wiki/${this.cardId}`;
        }
    },
    methods: {
        contextEvent(e) {
            this.$emit("deckcardrightclick", e);
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/mixins";
@import "node_modules/bootstrap/scss/variables";

@import "../styles/variables.custom";

.deck-card {
    position: relative;
    margin: 5px;
}

.deck-card img {
    height: 140px;
    width: 100px;
    margin-bottom: 0;
}

.deck-card-text {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: $gray-200;
    opacity: 0;
    transition: opacity 0.15s;
    text-align: center;
    color: $gray-800;
    word-wrap: break-word;
    line-height: 1.125em;
    font-size: 0.85em;
    &:focus,
    &:hover {
        opacity: 1;
    }
}
</style>
