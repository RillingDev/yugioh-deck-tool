import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataStore = defineStore("data", () => {
	const essentialDataLoaded = ref(false);
	const loading = ref(false);

	return {
		essentialDataLoaded,
		loading,
	};
});
