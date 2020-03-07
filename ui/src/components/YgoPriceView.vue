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
import { CardDatabase, PriceService, Card } from "../../../core";
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component({})
export default class YgoPriceView extends Vue {
    @Prop()
    item: string | Array<string>;

    priceController = uiContainer.get<PriceController>(
        UI_TYPES.PriceController
    );
    priceService = uiContainer.get<PriceService>(UI_TYPES.PriceService);
    cardDatabase = uiContainer.get<CardDatabase>(UI_TYPES.CardDatabase);

    get isGroup() {
        return !isString(this.item);
    }

    get priceValues() {
        const cards = this.isGroup
            ? (this.item as Array<string>).map(item =>
                  this.cardDatabase.getCard(item)
              )
            : [this.cardDatabase.hasCard(this.item as string)];
        return this.priceService.getPrice(...(cards as Card[])).prices;
    }
}
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
