<template>
    <div>
        <button class="btn btn-primary btn-sm" @click="() => openModal()">
            Clear
        </button>

        <BModal
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
import { defineComponent, ref } from "@vue/composition-api";
import { appStore } from "../../composition/appStore";
import { DECK_CLEAR } from "../../store/modules/deck";
import { BModal } from "bootstrap-vue";

export default defineComponent({
    components: {
        BModal,
    },
    props: {},
    setup: function (props, context) {
        const modal = ref<BModal>();

        const openModal = (): void => modal.value?.show();
        const clear = (): void => appStore(context).commit(DECK_CLEAR);

        return { modal, openModal, clear };
    },
});
</script>
