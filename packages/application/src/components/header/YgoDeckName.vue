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

export default defineComponent({
    components: {},
    props: {},
    setup: function (props, context) {
        const deckName = computed<string>({
            get() {
                return context.root.$store.state.deck.active.name;
            },
            set(newName) {
                context.root.$store.commit(DECK_NAME_UPDATE, { name: newName });
            },
        });

        return { deckName };
    },
});
</script>
