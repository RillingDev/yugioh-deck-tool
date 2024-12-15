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
import { defineComponent } from "vue";

import VSelect from "vue-select";
import { Format } from "@/core/lib";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";

export default defineComponent({
	components: { VSelect },
	props: {},
	emits: [],
	setup() {
		const formats = Object.values(Format);

		const { format } = storeToRefs(useFormatStore());

		return { formats, format };
	},
});
</script>
