<template>
    <form>
        <div class="form-group row">
            <label class="col-lg-2 col-form-label">
                Sort by
            </label>
            <div class="col-lg-6">
                <VSelect
                    title="Sorting Strategy"
                    :clearable="false"
                    :options="sortingStrategies"
                    @input="optionsChanged"
                    v-model="reactiveSortingOptions.strategy"
                />
            </div>
            <div class="col-lg-4">
                <VSelect
                    title="Sorting Order"
                    :clearable="false"
                    :options="sortingOrders"
                    @input="optionsChanged"
                    v-model="reactiveSortingOptions.order"
                />
            </div>
        </div>
    </form>
</template>

<script lang="ts">
import { PropType } from "vue";
import {
    SortingOptions,
    SortingOrder,
    SortingStrategy,
} from "../../../../core/src/main";
import { cloneDeep } from "lodash";
import { defineComponent, reactive } from "@vue/composition-api";
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
        const reactiveSortingOptions = reactive<SortingOptions>(
            cloneDeep(props.sortingOptions)
        );

        const sortingStrategies = [
            SortingStrategy.LEVEL,
            SortingStrategy.ATK,
            SortingStrategy.DEF,
            SortingStrategy.NAME,
            SortingStrategy.RELEASE_DATE,
        ];
        const sortingOrders = [SortingOrder.DESC, SortingOrder.ASC];

        const optionsChanged = () =>
            context.emit("change", reactiveSortingOptions);

        return {
            sortingStrategies,
            sortingOrders,

            reactiveSortingOptions,

            optionsChanged,
        };
    },
});
</script>
