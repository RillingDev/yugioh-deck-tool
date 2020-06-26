<template>
    <BDropdownItem @click="() => sort()">
        Sort
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../../composition/appStore";
import { DECK_SORT } from "../../../store/modules/deck";
import { BDropdownItem } from "bootstrap-vue";

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: (props, context) => {
        const sort = (): void => appStore(context).commit(DECK_SORT);

        return { sort };
    },
});
</script>
