import type { Format } from "@/core/lib";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFormatStore = defineStore("format", () => {
	const format = ref<Format | null>(null);

	return { format };
});
