import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";

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
				new URL("./node_modules/bootstrap", import.meta.url)
			),
			"~bootstrap-vue": fileURLToPath(
				new URL("./node_modules/bootstrap-vue", import.meta.url)
			),
			"~vue-select": fileURLToPath(
				new URL("./node_modules/vue-select", import.meta.url)
			),
		},
	},
	build: {
		rollupOptions: {
			input: {
				app: "src/application/main.ts",
				tooltip: "src/tooltip/main.ts",
			},
			output: {
				// Remove hashes from file name for easier manual inclusion.
				chunkFileNames: "common.js", // We only have one chunk, and it is the common code between the entry points.
				entryFileNames: "[name].js",
				assetFileNames: (chunkInfo) => {
					if (chunkInfo.name == "main.css") {
						// Use name of associated entry-point.
						if (
							typeof chunkInfo.source == "string" &&
							chunkInfo.source.includes(".card-tooltip") // Guess entry point based on content
						) {
							return "tooltip.css";
						}
						return "app.css";
					}

					return "[name][extname]";
				},
			},
		},
	},
});
