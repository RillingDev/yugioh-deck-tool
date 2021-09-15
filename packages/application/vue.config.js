module.exports = {
    transpileDependencies: true,
    lintOnSave: false,

    publicPath: "./",
    filenameHashing: false, // Cannot be used due to external embedding of dist output.
    chainWebpack: (config) => {
        // We have an additional entry point for standalone tooltip usage.
        config.entry("tooltip").add("@yugioh-deck-tool/tooltip");

        // Only use code common to both entry points for chunks, no vendor chunks.
        config.optimization.splitChunks({
            cacheGroups: {
                common: {
                    name: "common",
                    minChunks: 2,
                    priority: -20,
                    chunks: "initial",
                    reuseExistingChunk: true
                },
            },
        });

        // Always use ESM version as the normal version clutters `window` and causes issues when other JS code brings their own version.
        config.resolve.alias.set("lodash$", "lodash-es");

        // Remove opinionated root alias
        config.resolve.alias.delete("@");

        // Unbind unused plugins/rules
        config.module.rules.delete("tsx");
        config.module.rules.delete("pug");
        config.module.rules.delete("sass");
        config.module.rules.delete("postcss");
        config.module.rules.delete("less");
        config.module.rules.delete("stylus");
    },
};
