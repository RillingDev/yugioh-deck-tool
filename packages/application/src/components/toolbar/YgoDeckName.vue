<template>
    <input
        v-model="deckName"
        class="form-control"
        title="Deck Name"
        placeholder="Deck Name"
        type="text"
    />
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { DECK_NAME_UPDATE } from "../../store/modules/deck";
import { useAppStore } from "../../composition/state/useAppStore";

export default defineComponent({
    components: {},
    props: {},
    emits: [],
    setup(props, context) {
        const deckName = computed<string | null>({
            get: () => useAppStore(context).state.deck.active.name,
            set: (newName) =>
                useAppStore(context).commit(DECK_NAME_UPDATE, {
                    name: newName,
                }),
        });

        return { deckName };
    },
});
</script>
