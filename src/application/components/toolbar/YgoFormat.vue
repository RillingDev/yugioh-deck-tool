<template>
	<div class="form-group">
		<VSelect
			v-model="format"
			:options="formats"
			:clearable="true"
			:searchable="false"
		>
			<template #header>
				<label>Format</label>
			</template>
		</VSelect>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, readonly } from "vue";

import VSelect from "vue-select";
import { FORMAT_UPDATE } from "../../store/modules/format";
import { Format } from "@/core/lib";
import { useStore } from "../../store/store";

export default defineComponent({
	components: { VSelect },
	props: {},
	emits: [],
	setup() {
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
