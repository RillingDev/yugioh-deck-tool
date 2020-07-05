<template>
    <BDropdownItem @click="() => sort()" :disabled="isDeckEmpty">
        <span class="fas fa-sort fas-in-button" aria-hidden="true"></span>
        Sort
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../../composition/appStore";
import { DECK_SORT } from "../../../store/modules/deck";
import { BDropdownItem } from "bootstrap-vue";
import { deckEmpty } from "../../../composition/deckEmpty";

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: (props, context) => {
        const sort = (): void => appStore(context).commit(DECK_SORT);
        const isDeckEmpty = deckEmpty(context);

        return { isDeckEmpty, sort };
    },
});
</script>
