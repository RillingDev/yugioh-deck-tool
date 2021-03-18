<template>
    <VSelect
        :options="formats"
        :clearable="true"
        :searchable="false"
        title="Format"
        placeholder="Format"
        v-model="format"
    />
</template>

<script lang="ts">
import { computed, defineComponent, readonly } from "@vue/composition-api";

import VSelect from "vue-select";
import { FORMAT_UPDATE } from "../../store/modules/format";
import { Format } from "../../../../core/src/main";
import { useAppStore } from "../../composition/state/useAppStore";

export default defineComponent({
    props: {},
    emits: [],
    components: { VSelect },
    setup(props, context) {
        const formats = readonly<Format[]>(Object.values(Format));
        const format = computed<Format | null>({
            get: () => useAppStore(context).state.format.active,
            set: (newFormat) =>
                useAppStore(context).commit(FORMAT_UPDATE, {
                    format: newFormat,
                }),
        });

        return { formats, format };
    },
});
</script>
