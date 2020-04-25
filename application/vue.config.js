module.exports = {
    publicPath: "./",
    filenameHashing: false, // Cannot be used due to external embedding of dist output.
    chainWebpack: (config) => {
        // We have an additional entry point for standalone tooltip usage.
        config.entry("tooltip").add("../tooltip/src/main.ts")

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

        // Unbind unused plugins/rules
        config.plugins.delete("preload");
        config.plugins.delete("prefetch");
        config.module.rules.delete("tsx");
        config.module.rules.delete("pug");
        config.module.rules.delete("sass");
        config.module.rules.delete("less");
        config.module.rules.delete("stylus");
    },
};
