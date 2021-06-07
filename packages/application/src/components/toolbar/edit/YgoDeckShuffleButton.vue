<template>
    <BDropdownItemButton :disabled="isDeckEmpty" @click="() => shuffle()">
        <span class="fas fa-random fas-in-button" aria-hidden="true"></span>
        Shuffle
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DECK_SHUFFLE } from "../../../store/modules/deck";
import { BDropdownItemButton } from "bootstrap-vue";
import { useDeckEmpty } from "../../../composition/state/useDeckEmpty";
import { useStore } from "../../../store/store";

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    emits: [],
    setup(props, context) {
        const shuffle = (): void => useStore().commit(DECK_SHUFFLE);
        const isDeckEmpty = useDeckEmpty();

        return { isDeckEmpty, shuffle };
    },
});
</script>
