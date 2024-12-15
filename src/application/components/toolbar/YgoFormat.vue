<template>
	<VSelect v-model="format" :items="formats" label="Format" clearable />
</template>

<script setup lang="ts">
import { Format } from "@/core/lib";
import { useFormatStore } from "@/application/store/format";
import { storeToRefs } from "pinia";
import { VSelect } from "vuetify/components/VSelect";

const formats = Object.values(Format);

const { format } = storeToRefs(useFormatStore());
</script>
