import { URL, fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
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
