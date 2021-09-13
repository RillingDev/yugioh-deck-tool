<template>
    <BDropdownItemButton :disabled="deckEmpty" @click="() => shuffle()">
        <span class="fas fa-random fas-in-button" aria-hidden="true"></span>
        Shuffle
    </BDropdownItemButton>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { DECK_SHUFFLE } from "../../../store/modules/deck";
import { BDropdownItemButton } from "bootstrap-vue";
import { useStore } from "../../../store/store";

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    emits: [],
    setup() {
        const store = useStore();

        const deckEmpty = computed<boolean>(() => store.getters.isDeckEmpty);

        const shuffle = (): void => store.commit(DECK_SHUFFLE);

        return { deckEmpty, shuffle };
    },
});
</script>
