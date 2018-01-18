<template>
    <div class="form-group form-group-select">
        <label>{{ title }}:</label>
        <select
            class="form-control"
            v-model="selected"
            :title="title"
            @change="emitInput"
        >
            <option
                v-for="option in options"
                :key="option"
                :value="option"
            >{{ option }}</option>
        </select>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            required: false,
            default: "Select"
        }
    },
    data: () => {
        return {
            selected: null
        };
    },
    mounted() {
        this.selected = this.options[0];
    },
    methods: {
        emitInput() {
            this.$emit("input", this.selected);
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/mixins";
@import "node_modules/bootstrap/scss/variables";

@import "../styles/variables.custom";

.form-group-select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    label {
        padding-right: 0.5rem;
        margin-bottom: 0;
    }
    select {
        max-width: 80%;
    }
}
</style>
