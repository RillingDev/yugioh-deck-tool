<template>
    <select :title="title" v-model="value" v-on:change="() => onChange()">
        <option
            :key="option == null ? '__ANY' : renderByProp(option, trackBy)"
            :value="option"
            v-for="option in options"
        >
            {{ option == null ? "---" : renderByProp(option, label) }}
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

    @Prop({ required: false, default: false })
    noSelectionAllowed: boolean;

    @Prop({ required: false, default: null })
    title: string | null;

    @Prop({ required: false })
    label: (T) => string;

    @Prop({ required: false })
    trackBy: (T) => string;

    value: T | null;

    get options(): Array<T | null> {
        return this.noSelectionAllowed
            ? [null, ...this.initialOptions]
            : this.initialOptions;
    }

    // Default props seem to sporadically have incorrect types, this is a workaround.
    renderByProp(val: T, fn?: (val: T) => string) {
        return fn != null ? fn(val) : String(val);
    }

    data() {
        return {
            value: this.initialValue,
        };
    }

    onChange() {
        this.$emit("input", this.value);
    }
}
</script>
