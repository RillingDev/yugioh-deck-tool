<template>
    <div>
        <button class="btn btn-primary btn-sm" @click="() => shuffle()">
            Shuffle
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { appStore } from "../../composition/appStore";
import { DECK_SHUFFLE } from "../../store/modules/deck";

export default defineComponent({
    components: {},
    props: {},
    setup: function (props, context) {
        const shuffle = (): void => appStore(context).commit(DECK_SHUFFLE);

        return { shuffle };
    },
});
</script>
