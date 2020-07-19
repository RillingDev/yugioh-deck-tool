<template>
    <BDropdownItemButton @click="() => shuffle()" :disabled="isDeckEmpty">
        <span class="fas fa-random fas-in-button" aria-hidden="true"></span>
        Shuffle
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../../composition/state/appStore";
import { DECK_SHUFFLE } from "../../../store/modules/deck";
import { BDropdownItemButton } from "bootstrap-vue";
import { deckEmpty } from "../../../composition/state/deckEmpty";

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    setup: (props, context) => {
        const shuffle = (): void => appStore(context).commit(DECK_SHUFFLE);
        const isDeckEmpty = deckEmpty(context);

        return { isDeckEmpty, shuffle };
    },
});
</script>
