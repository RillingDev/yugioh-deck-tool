<template>
    <BDropdownItemButton :disabled="isDeckEmpty" @click="() => sort()">
        <span class="fas fa-sort fas-in-button" aria-hidden="true"></span>
        Sort
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useAppStore } from "../../../composition/state/useAppStore";
import { DECK_SORT } from "../../../store/modules/deck";
import { BDropdownItemButton } from "bootstrap-vue";
import { useDeckEmpty } from "../../../composition/state/useDeckEmpty";

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    emits: [],
    setup(props, context) {
        const sort = (): void => useAppStore(context).commit(DECK_SORT);
        const isDeckEmpty = useDeckEmpty(context);

        return { isDeckEmpty, sort };
    },
});
</script>
