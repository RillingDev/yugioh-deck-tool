<template>
    <BDropdownItemButton :disabled="deckEmpty" @click="() => sort()">
        <span class="fas fa-sort fas-in-button" aria-hidden="true"></span>
        Sort
    </BDropdownItemButton>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { DECK_SORT } from "../../../store/modules/deck";
import { BDropdownItemButton } from "bootstrap-vue";
import { useStore } from "../../../store/store";

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    emits: [],
    setup(props, context) {
        const store = useStore();

        const deckEmpty = computed<boolean>(() => store.getters.isDeckEmpty);

        const sort = (): void => store.commit(DECK_SORT);

        return { deckEmpty, sort };
    },
});
</script>
