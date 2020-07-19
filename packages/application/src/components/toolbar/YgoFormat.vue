<template>
    <VSelect
        :options="formats"
        :clearable="false"
        :searchable="false"
        title="Format"
        v-model="format"
    />
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";

import VSelect from "vue-select";
import { FORMAT_UPDATE } from "../../store/modules/format";
import { Format } from "../../../../core/src/main";
import { appStore } from "../../composition/state/appStore";

export default defineComponent({
    components: { VSelect },
    props: {},
    setup: (props, context) => {
        const formats = Object.values(Format);
        const format = computed<Format>({
            get() {
                return appStore(context).state.format.active;
            },
            set(newFormat) {
                appStore(context).commit(FORMAT_UPDATE, {
                    format: newFormat,
                });
            },
        });

        return { formats, format };
    },
});
</script>
