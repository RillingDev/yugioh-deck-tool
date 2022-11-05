import type { Format } from "@/core/lib";
import { defineStore } from "pinia";

interface FormatState {
	format: Format | null;
}

export const useFormatStore = defineStore("format", {
	state(): FormatState {
		return {
			format: null,
		};
	},
});
