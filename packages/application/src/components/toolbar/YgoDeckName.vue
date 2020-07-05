<template>
    <input
        class="form-control"
        title="Deck Name"
        placeholder="Deck Name"
        type="text"
        v-model="deckName"
    />
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { DECK_NAME_UPDATE } from "../../store/modules/deck";
import { appStore } from "../../composition/appStore";

export default defineComponent({
    components: {},
    props: {},
    setup: (props, context) => {
        const deckName = computed<string | null>({
            get() {
                return appStore(context).state.deck.active.name;
            },
            set(newName) {
                appStore(context).commit(DECK_NAME_UPDATE, { name: newName });
            },
        });

        return { deckName };
    },
});
</script>
