<template>
    <form>
        <div class="form-group row">
            <div class="col-lg-3">
                <label class="col-form-label">
                    Sort by
                </label>
            </div>
            <div class="col-lg-5">
                <VSelect
                    title="Sorting Strategy"
                    :clearable="false"
                    :options="sortingStrategies"
                    @input="onOptionsChanged"
                    v-model="internalSortingOptions.strategy"
                />
            </div>
            <div class="col-lg-4">
                <VSelect
                    title="Sorting Order"
                    :clearable="false"
                    :options="sortingOrders"
                    @input="onOptionsChanged"
                    v-model="internalSortingOptions.order"
                />
            </div>
        </div>
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

        const sortingStrategies = [
            SortingStrategy.LEVEL,
            SortingStrategy.ATK,
            SortingStrategy.DEF,
            SortingStrategy.NAME,
            SortingStrategy.RELEASE_DATE,
        ];
        const sortingOrders = [SortingOrder.DESC, SortingOrder.ASC];

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
