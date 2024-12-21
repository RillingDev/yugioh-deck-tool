import type { CardCountFunction } from "@/core/lib";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCollectionStore = defineStore("collection", () => {
	const cardCountFunction = ref<CardCountFunction | null>(null);

	return { cardCountFunction };
});
