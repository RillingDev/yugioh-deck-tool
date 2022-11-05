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
import { defineComponent, readonly } from "vue";

import VSelect from "vue-select";
import { Format } from "@/core/lib";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";

export default defineComponent({
	components: { VSelect },
	props: {},
	emits: [],
	setup() {
		const formats = readonly<Format[]>(Object.values(Format));

		const { format } = storeToRefs(useFormatStore());

		return { formats, format };
	},
});
</script>
