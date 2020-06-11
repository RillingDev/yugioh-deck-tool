<template>
    <button class="btn btn-primary btn-sm" @click="() => sort()">
        Sort
    </button>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../composition/appStore";
import { DECK_SORT } from "../../store/modules/deck";

export default defineComponent({
    components: {},
    props: {},
    setup: function (props, context) {
        const sort = (): void => appStore(context).commit(DECK_SORT);

        return { sort };
    },
});
</script>
