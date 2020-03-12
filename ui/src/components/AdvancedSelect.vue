<template>
    <select v-on:change="() => onChange()" :title="title" v-model="value">
        <option
            :key="option == null ? '__ANY' : trackBy(option)"
            :value="option"
            v-for="option in options"
        >
            {{ option == null ? "---" : label(option) }}
        </option>
    </select>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Model, Prop } from "vue-property-decorator";

@Component({})
export default class AdvancedSelect<T> extends Vue {
    @Model("input")
    initialValue: T | null;

    @Prop({ required: true })
    initialOptions: T[];

    @Prop({ required: false, default: () => false })
    noSelectionAllowed: boolean;

    @Prop({ required: false, default: () => null })
    title: string | null;

    @Prop({ required: false, default: ()=>(val) => val })
    label: (T)=>string;

    @Prop({ required: false, default:  ()=>(val) => val })
    trackBy: (T)=>string;

    value: T | null;

    options: Array<T | null>;

    data() {
        return {
            options: this.noSelectionAllowed
                ? [null, ...this.initialOptions]
                : this.initialOptions,
            value: this.initialValue
        };
    }

    onChange() {
        this.$emit("input", this.value);
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
