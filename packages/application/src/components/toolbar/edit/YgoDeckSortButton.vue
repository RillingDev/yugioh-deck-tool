<template>
    <BDropdownItemButton :disabled="isDeckEmpty" @click="() => sort()">
        <span class="fas fa-sort fas-in-button" aria-hidden="true"></span>
        Sort
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DECK_SORT } from "../../../store/modules/deck";
import { BDropdownItemButton } from "bootstrap-vue";
import { useDeckEmpty } from "../../../composition/state/useDeckEmpty";
import { useStore } from "../../../store/store";

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    emits: [],
    setup(props, context) {
        const sort = (): void => useStore().commit(DECK_SORT);
        const isDeckEmpty = useDeckEmpty();

        return { isDeckEmpty, sort };
    },
});
</script>
