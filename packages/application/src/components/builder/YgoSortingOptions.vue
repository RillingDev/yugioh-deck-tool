<template>
    <form class="form-group">
        <div class="form-row">
            <div class="col-12 col-md-2">
                <label class="col-form-label" for="sortingStrategy">
                    Sort by
                </label>
            </div>
            <div class="col-6 col-md-5">
                <BFormSelect
                    class="form-control"
                    id="sortingStrategy"
                    :options="sortingStrategies"
                    @input="() => onOptionsChanged()"
                    v-model="internalSortingOptions.strategy"
                />
            </div>
            <div class="col-6 col-md-5">
                <BFormSelect
                    class="form-control"
                    aria-label="Sorting Order"
                    :options="sortingOrders"
                    @input="() => onOptionsChanged()"
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
import { BFormSelect } from "bootstrap-vue";

export default defineComponent({
    props: {
        sortingOptions: {
            required: true,
            type: Object as PropType<SortingOptions>,
        },
    },
    components: {
        VSelect,
        BFormSelect,
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
