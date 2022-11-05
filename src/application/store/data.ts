import { defineStore } from "pinia";

interface DataState {
	essentialDataLoaded: boolean;
	loading: boolean;
}

export const useDataStore = defineStore("data", {
	state(): DataState {
		return {
			essentialDataLoaded: false,
			loading: true,
		};
	},
	actions: {
		setEssentialDataLoaded() {
			this.essentialDataLoaded = true;
		},
		setLoading(payload: { loading: boolean }) {
			this.loading = payload.loading;
		},
	},
});
