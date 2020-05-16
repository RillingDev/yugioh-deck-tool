<template>
    <form>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="sortingStrategy">
                Sorting
            </label>
            <div class="col-sm-6">
                <VSelect
                    :clearable="false"
                    :options="sortingStrategies"
                    @input="optionsChanged"
                    id="sortingStrategy"
                    v-model="reactiveOptions.strategy"
                />
            </div>
            <div class="col-sm-4">
                <VSelect
                    :clearable="false"
                    :options="sortingOrders"
                    @input="optionsChanged"
                    v-model="reactiveOptions.order"
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
} from "yugioh-deck-tool-core/src/main";
import { cloneDeep } from "lodash";
import { defineComponent, reactive } from "@vue/composition-api";
import VSelect from "vue-select";

export default defineComponent({
    props: {
        options: {
            required: true,
            type: Object as PropType<SortingOptions>,
        },
    },
    components: {
        VSelect,
    },
    model: {
        prop: "options",
        event: "change",
    },
    setup(props, context) {
        const reactiveOptions = reactive<SortingOptions>(
            cloneDeep(props.options)
        );

        const sortingStrategies = [
            SortingStrategy.LEVEL,
            SortingStrategy.ATK,
            SortingStrategy.DEF,
            SortingStrategy.NAME,
            SortingStrategy.RELEASE_DATE,
        ];
        const sortingOrders = [SortingOrder.DESC, SortingOrder.ASC];

        const optionsChanged = () => context.emit("change", reactiveOptions);

        return {
            sortingStrategies,
            sortingOrders,

            reactiveOptions,
            optionsChanged,
        };
    },
});
</script>
