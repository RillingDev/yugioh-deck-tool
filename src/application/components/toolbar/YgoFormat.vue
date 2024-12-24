<template>
	<VSelect v-model="format" :items="formats" label="Format" clearable />
</template>

<script setup lang="ts">
import { useFormatStore } from "@/application/store/format";
import { Format } from "@/core/lib";
import { storeToRefs } from "pinia";
import { VSelect } from "vuetify/components/VSelect";

const formats = Object.values(Format);

const { format } = storeToRefs(useFormatStore());
</script>
