module.exports = {
    publicPath: "./",
    filenameHashing: false, // Cannot be used due to external embedding of dist output.
    chainWebpack: (config) => {
        config.entry("tooltip").add("../tooltip/src/main.ts")
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
        config.module.rules.delete("eslint");
        config.module.rules.delete("pug");
        config.module.rules.delete("postcss");
        config.module.rules.delete("sass");
        config.module.rules.delete("less");
        config.module.rules.delete("stylus");
    },
};
