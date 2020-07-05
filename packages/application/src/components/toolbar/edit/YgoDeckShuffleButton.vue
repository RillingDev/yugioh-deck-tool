<template>
    <BDropdownItem @click="() => shuffle()" :disabled="isDeckEmpty">
        <span class="fas fa-random fas-in-button" aria-hidden="true"></span>
        Shuffle
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../../composition/appStore";
import { DECK_SHUFFLE } from "../../../store/modules/deck";
import { BDropdownItem } from "bootstrap-vue";
import { deckEmpty } from "../../../composition/deckEmpty";

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: (props, context) => {
        const shuffle = (): void => appStore(context).commit(DECK_SHUFFLE);
        const isDeckEmpty = deckEmpty(context);

        return { isDeckEmpty, shuffle };
    },
});
</script>
