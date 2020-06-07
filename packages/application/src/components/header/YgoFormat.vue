<template>
    <VSelect
        :options="formats"
        :clearable="false"
        title="Format"
        v-model="format"
    />
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";

import VSelect from "vue-select";
import { FORMAT_UPDATE } from "../../store/modules/format";
import { Format } from "yugioh-deck-tool-core/src/main";

export default defineComponent({
    components: { VSelect },
    props: {},
    setup: function (props, context) {
        const formats = Object.values(Format);
        const format = computed<Format>({
            get() {
                return context.root.$store.state.format.active;
            },
            set(newFormat) {
                context.root.$store.commit(FORMAT_UPDATE, {
                    format: newFormat,
                });
            },
        });

        return { formats, format };
    },
});
</script>
