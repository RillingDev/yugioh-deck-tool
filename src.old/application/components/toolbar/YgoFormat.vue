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

<script setup lang="ts">
import VSelect from "vue-select";
import { Format } from "@/core/lib";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";

const formats = Object.values(Format);

const { format } = storeToRefs(useFormatStore());
</script>
