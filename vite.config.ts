import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools()],
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
			input: {
				tooltip: "src/tooltip/main.ts", // Tooltip, can be used on its own.
				app: "index.html", // Standalone and embeddable application.
			},
			output: {
				// Remove hashes from file name for easier manual inclusion.
				entryFileNames: "[name].js",
				assetFileNames: (chunkInfo) => {
					// use filenames consistent with entry point
					if (chunkInfo.name == "main.css") {
						return "tooltip.css";
					}
					if (chunkInfo.name == "index.css") {
						return "app.css";
					}

					return "[name][extname]";
				},
			},
		},
	},
});
