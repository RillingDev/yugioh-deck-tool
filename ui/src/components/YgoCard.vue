<template>
    <a
        :data-name="card.name"
        :href="referenceUrl"
        @contextmenu="contextEvent"
        class="deck-card"
        target="_blank"
    >
        <img :alt="card.name" :src="imageUrl" height="135" width="100" />
        <div class="deck-card-text">
            <span class="deck-card-name">{{ card.name }}</span>
            <slot class="deck-card-price" name="price" />
        </div>
    </a>
</template>

<script lang="ts">
import { URL_DB_API, URL_IMAGE_UNKNOWN } from "../lib/data/urls";

const NAME_UNKNOWN = "Unknown";
export default {
    props: {
        card: {
            type: Object,
            default: () => {
                return {
                    name: NAME_UNKNOWN,
                    imageUrl: URL_IMAGE_UNKNOWN,
                    referenceUrl: URL_DB_API
                };
            }
        }
    },
    computed: {
        imageUrl() {
            return this.card.image?.urlSmall ?? URL_IMAGE_UNKNOWN;
        },
        referenceUrl() {
            if (this.card.name === NAME_UNKNOWN) {
                return URL_DB_API;
            }
            return URL_DB_API + encodeURI(this.card.name);
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
