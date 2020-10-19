<template>
    <BDropdownItemButton @click="() => sort()" :disabled="isDeckEmpty">
        <span class="fas fa-sort fas-in-button" aria-hidden="true"></span>
        Sort
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../../composition/state/appStore";
import { DECK_SORT } from "../../../store/modules/deck";
import { BDropdownItemButton } from "bootstrap-vue";
import { deckEmpty } from "../../../composition/state/deckEmpty";

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    setup(props, context) {
        const sort = (): void => appStore(context).commit(DECK_SORT);
        const isDeckEmpty = deckEmpty(context);

        return { isDeckEmpty, sort };
    },
});
</script>
