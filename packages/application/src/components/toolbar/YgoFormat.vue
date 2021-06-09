<template>
    <VSelect
        v-model="format"
        :options="formats"
        :clearable="true"
        :searchable="false"
        title="Format"
        placeholder="Format"
    />
</template>

<script lang="ts">
import { computed, defineComponent, readonly } from "@vue/composition-api";

import VSelect from "vue-select";
import { FORMAT_UPDATE } from "../../store/modules/format";
import { Format } from "@yugioh-deck-tool/core";
import { useStore } from "../../store/store";

export default defineComponent({
    components: { VSelect },
    props: {},
    emits: [],
    setup(props, context) {
        const formats = readonly<Format[]>(Object.values(Format));

        const store = useStore();

        const format = computed<Format | null>({
            get: () => store.state.format.active,
            set: (newFormat) =>
                store.commit(FORMAT_UPDATE, {
                    format: newFormat,
                }),
        });

        return { formats, format };
    },
});
</script>
