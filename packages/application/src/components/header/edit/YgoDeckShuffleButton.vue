<template>
    <BDropdownItem @click="() => shuffle()">
        Shuffle
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../../composition/appStore";
import { DECK_SHUFFLE } from "../../../store/modules/deck";
import { BDropdownItem } from "bootstrap-vue";

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: (props, context) => {
        const shuffle = (): void => appStore(context).commit(DECK_SHUFFLE);

        return { shuffle };
    },
});
</script>
