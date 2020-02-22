<template>
    <a
        :data-name="card.name"
        :href="card.referenceUrl"
        @contextmenu="contextEvent"
        class="deck-card"
        target="_blank"
    >
        <img :alt="card.name" :src="card.imageUrl" height="135" width="100" />
        <div class="deck-card-text">
            <span class="deck-card-name">{{ card.name }}</span>
            <slot class="deck-card-price" name="price" />
        </div>
    </a>
</template>

<script>
import { URL_DB_API, URL_IMAGE_UNKNOWN } from "../lib/data/urls";

export default {
    props: {
        card: {
            type: Object,
            default: () => {
                return {
                    name: "Unknown",
                    imageUrl: URL_IMAGE_UNKNOWN,
                    referenceUrl: URL_DB_API
                };
            }
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
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    padding: 6px;
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
