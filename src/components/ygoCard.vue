<template>
  <a
    :href="link"
    :data-name="cardId"
    class="deck-card"
    target="_blank"
    @contextmenu="contextEvent"
  >
    <img :src="image" :alt="cardName" width="100" height="135" />
    <div class="deck-card-text">
      <span class="deck-card-name">{{ cardName || `[${cardId}]` }}</span>
      <slot class="deck-card-price" name="price" />
    </div>
  </a>
</template>

<script>
import { isNil } from "lightdash";
import {
  URL_IMAGE_API,
  URL_IMAGE_UNKNOWN,
  URL_DB_API,
  URL_WIKI_API
} from "../lib/data/urls";

export default {
  props: {
    cardId: {
      type: String,
      required: true
    },
    cardName: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    hasData() {
      return !isNil(this.cardName);
    },
    image() {
      return this.hasData
        ? `${URL_IMAGE_API}/${this.cardId}.jpg`
        : URL_IMAGE_UNKNOWN;
    },
    link() {
      return this.hasData
        ? URL_DB_API + encodeURI(this.cardName)
        : URL_WIKI_API + this.cardId;
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
