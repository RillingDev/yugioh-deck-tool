const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
	transpileDependencies: true,
	lintOnSave: false,

	publicPath: "./",
	filenameHashing: false, // Cannot be used due to external embedding of dist output.
	chainWebpack: (config) => {
		// We have an additional entry point for standalone tooltip usage.
		config
			.entry("app")
			.delete("./src/main.ts")
			.add("./src/application/main.ts");
		config.entry("tooltip").add("./src/tooltip/main.ts");

		// Only use code common to both entry points for chunks, no vendor chunks.
		config.optimization.splitChunks({
			cacheGroups: {
				common: {
					name: "common",
					minChunks: 2,
					priority: -20,
					chunks: "initial",
					reuseExistingChunk: true,
				},
			},
		});
		// "@" == source root
		// Note that these are specified inside the tsconfig as well.
		config.resolve.alias.set("@yugioh-deck-tool/core", "@/core/main.ts");
		config.resolve.alias.set("@yugioh-deck-tool/ygoprodeck", "@/ygoprodeck/main.ts");
		config.resolve.alias.set("@yugioh-deck-tool/browser-common", "@/browser-common/main.ts");
		config.resolve.alias.set("@yugioh-deck-tool/tooltip", "@/tooltip/main.ts");
		config.resolve.alias.set("@yugioh-deck-tool/application", "@/application/main.ts");

		// Always use ESM version as the normal version clutters `window` and causes issues when other JS code brings their own version.
		config.resolve.alias.set("lodash$", "lodash-es");

		// Unbind unused plugins/rules
		config.module.rules.delete("tsx");
		config.module.rules.delete("pug");
		config.module.rules.delete("sass");
		config.module.rules.delete("postcss");
		config.module.rules.delete("less");
		config.module.rules.delete("stylus");
	},
});
