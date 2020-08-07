<template>
    <form class="form-group sorting-options">
        <label class="sorting-options__label w-50">
            Sort by
        </label>
        <VSelect
            class="sorting-options__input w-100"
            title="Sorting Strategy"
            :options="sortingStrategies"
            :clearable="false"
            :searchable="false"
            @input="() => onOptionsChanged()"
            v-model="internalSortingOptions.strategy"
        />
        <VSelect
            class="sorting-options__input w-100"
            title="Sorting Order"
            :options="sortingOrders"
            :clearable="false"
            :searchable="false"
            @input="() => onOptionsChanged()"
            v-model="internalSortingOptions.order"
        />
    </form>
</template>

<script lang="ts">
import {
    SortingOptions,
    SortingOrder,
    SortingStrategy,
} from "../../../../core/src/main";
import { defineComponent, PropType, reactive } from "@vue/composition-api";
import VSelect from "vue-select";

export default defineComponent({
    props: {
        sortingOptions: {
            required: true,
            type: Object as PropType<SortingOptions>,
        },
    },
    components: {
        VSelect,
    },
    model: {
        prop: "sortingOptions",
        event: "change",
    },
    setup(props, context) {
        const internalSortingOptions = reactive<SortingOptions>(
            props.sortingOptions
        );

        const sortingStrategies = Object.values(SortingStrategy);
        const sortingOrders = Object.values(SortingOrder);

        const onOptionsChanged = (): void =>
            context.emit("change", internalSortingOptions);

        return {
            sortingStrategies,
            sortingOrders,

            internalSortingOptions,

            onOptionsChanged,
        };
    },
});
</script>
<style lang="scss">
@import "../../../../ui/src/styles/variables";
@import "../../../../ui/src/styles/mixins";

.deck-tool {
    .sorting-options {
        display: flex;
        flex-direction: column;

        gap: $margin-md;

        margin-bottom: $margin-md;

        @include screen-min-width(md) {
            flex-direction: row;
            align-items: center;
        }

        &__label {
            margin: 0;
        }
    }
}
</style>
