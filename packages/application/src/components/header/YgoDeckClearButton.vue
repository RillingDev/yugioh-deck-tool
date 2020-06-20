<template>
    <div>
        <button class="btn btn-primary btn-sm" v-b-modal.clearDeck>
            Clear
        </button>

        <BModal
            id="clearDeck"
            modal-class="deck-tool__portal"
            ref="modal"
            title="Clear Deck"
            @ok="() => clear()"
        >
            <p>Are you sure you want to clear the deck?</p>
        </BModal>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../composition/appStore";
import { DECK_CLEAR } from "../../store/modules/deck";
import { BModal } from "bootstrap-vue";

export default defineComponent({
    components: {
        BModal,
    },
    props: {},
    setup: (props, context) => {
        const clear = (): void => appStore(context).commit(DECK_CLEAR);

        return { clear };
    },
});
</script>
