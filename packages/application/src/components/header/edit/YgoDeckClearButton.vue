<template>
    <BDropdownItem v-b-modal.clearDeck>
        Clear

        <BModal
            id="clearDeck"
            modal-class="deck-tool__portal"
            ref="modal"
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

export default defineComponent({
    components: {
        BModal,
        BDropdownItem,
    },
    props: {},
    setup: (props, context) => {
        const clear = (): void => appStore(context).commit(DECK_CLEAR);

        return { clear };
    },
});
</script>
