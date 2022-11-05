import type { Format } from "@/core/lib";
import { defineStore } from "pinia";

interface FormatState {
	active: Format | null;
}

export const useFormatStore = defineStore("format", {
	state(): FormatState {
		return {
			active: null,
		};
	},
	actions: {
		setFormat(payload: { format: Format | null }) {
			this.active = payload.format;
		},
	},
});
