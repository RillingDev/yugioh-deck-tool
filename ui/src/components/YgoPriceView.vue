<template>
    <div :class="{ 'price--group': isGroup }" class="price">
        <span
            :class="'price-mode-' + priceMode.id"
            :key="priceMode.id"
            :title="`${priceMode.name} Price`"
            class="price-mode"
            v-for="priceMode in priceController.modes"
        >
            <span v-if="isGroup">{{ priceMode.name }}: </span>
            {{ priceController.format(priceValues[priceMode.id]) }}
        </span>
    </div>
</template>

<script lang="ts">
import { isString } from "lodash";
import { uiContainer } from "@/inversify.config";
import { PriceController } from "@/lib/controller/PriceController";
import { UI_TYPES } from "@/types";
import { CardDatabase, PriceService } from "../../../core";

export default {
    props: {
        item: {
            type: [String, Array],
            required: true
        }
    },
    data: () => {
        return {
            priceController: uiContainer.get<PriceController>(
                UI_TYPES.PriceController
            ),
            priceService: uiContainer.get<PriceService>(UI_TYPES.PriceService),
            cardDatabase: uiContainer.get<CardDatabase>(UI_TYPES.CardDatabase)
        };
    },
    computed: {
        isGroup() {
            return !isString(this.item);
        },
        priceValues() {
            const cards = this.isGroup
                ? this.item.map(item => this.cardDatabase.getCard(item))
                : [this.cardDatabase.hasCard(this.item)];
            return this.priceService.getPrice(...cards).prices;
        }
    }
};
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../styles/variables.custom";

.price {
    &.price--group {
        margin-bottom: 0.5rem;
    }

    &:not(.price--group) {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}

.price-mode {
    font-size: 0.9em;
    display: inline-block;
    padding: 5px 8px 2px;
    text-align: center;

    &-tcgplayer {
        color: #fff;
        background-color: $color-pricemode-tcgplayer;
    }

    &-cardmarket {
        background-color: $color-pricemode-cardmarket;
    }

    &-ebay {
        background-color: $color-pricemode-ebay;
    }
}
</style>
