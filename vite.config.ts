import { fileURLToPath, URL } from "node:url";

import vue2 from "@vitejs/plugin-vue2";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue2()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			/*
			 * SCSS rewrites
			 */
			"~bootstrap": fileURLToPath(
				new URL("./node_modules/bootstrap", import.meta.url),
			),
			"~bootstrap-vue": fileURLToPath(
				new URL("./node_modules/bootstrap-vue", import.meta.url),
			),
			"~vue-select": fileURLToPath(
				new URL("./node_modules/vue-select", import.meta.url),
			),
		},
	},
	build: {
		rollupOptions: {
			output: {
				// Remove hashes from file name for easier manual inclusion.
				entryFileNames: "[name].js",
				assetFileNames: "[name][extname]",
			},
		},
	},
});
