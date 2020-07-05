<template>
    <BDropdownItem v-b-modal.clearDeck :disabled="isDeckEmpty">
        <span class="fas fa-trash fas-in-button" aria-hidden="true"></span>
        Clear
        <BModal
            id="clearDeck"
            modal-class="deck-tool__portal"
            title="Clear Deck"
            @ok="() => clear()"
        >
            <p>Are you sure you want to clear the deck?</p>
        </BModal>
    </BDropdownItem>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../../composition/appStore";
import { DECK_CLEAR } from "../../../store/modules/deck";
import { BDropdownItem, BModal } from "bootstrap-vue";
import { deckEmpty } from "../../../composition/deckEmpty";

export default defineComponent({
    components: {
        BModal,
        BDropdownItem,
    },
    props: {},
    setup: (props, context) => {
        const clear = (): void => appStore(context).commit(DECK_CLEAR);
        const isDeckEmpty = deckEmpty(context);

        return { isDeckEmpty, clear };
    },
});
</script>
