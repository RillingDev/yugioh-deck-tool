<template>
    <BDropdownItemButton @click="() => shuffle()" :disabled="isDeckEmpty">
        <span class="fas fa-random fas-in-button" aria-hidden="true"></span>
        Shuffle
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useAppStore } from "../../../composition/state/useAppStore";
import { DECK_SHUFFLE } from "../../../store/modules/deck";
import { BDropdownItemButton } from "bootstrap-vue";
import { useDeckEmpty } from "../../../composition/state/useDeckEmpty";

export default defineComponent({
    props: {},
    emits: [],
    components: { BDropdownItemButton },
    setup(props, context) {
        const shuffle = (): void => useAppStore(context).commit(DECK_SHUFFLE);
        const isDeckEmpty = useDeckEmpty(context);

        return { isDeckEmpty, shuffle };
    },
});
</script>
