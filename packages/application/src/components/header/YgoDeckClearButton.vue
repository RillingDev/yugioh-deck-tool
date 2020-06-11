<template>
    <button class="btn btn-primary btn-sm" @click="() => clear()">
        Clear
    </button>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../composition/appStore";
import { DECK_CLEAR } from "../../store/modules/deck";

export default defineComponent({
    components: {},
    props: {},
    setup: function (props, context) {
        const clear = (): void => appStore(context).commit(DECK_CLEAR);

        return { clear };
    },
});
</script>
