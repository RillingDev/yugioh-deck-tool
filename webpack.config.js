const path = require("path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const NODE_ENV = process.env.NODE_ENV;
const PRODUCTION_ENABLED = NODE_ENV === "production";
const CACHE_PATH = path.resolve(__dirname, "./.cache/");
const PUBLIC_PATH = path.resolve(__dirname, "./dist/");

/**
 * Plugins
 */
const pluginExtractCss = new MiniCssExtractPlugin({
    filename: "app.css",
    chunkFilename: "[id].css"
});
const pluginEnv = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
});
const pluginVue = new VueLoaderPlugin({});

/**
 * Optimizations
 */
const optimizationTerser = new TerserPlugin();

/**
 * Rules
 */
const ruleVue = {
    test: /\.vue$/,
    loader: "vue-loader",
    options: {}
};
const ruleBabel = {
    test: /\.js$/,
    use: {
        loader: "babel-loader",
        options: {
            cacheDirectory: path.join(CACHE_PATH, "babel/")
        }
    },
    exclude: file => !/\.vue\.js/.test(file)
};
const ruleScss = {
    test: /\.scss$/,
    use: [
        "vue-style-loader",
        MiniCssExtractPlugin.loader,
        "css-loader",
        "sass-loader"
    ]
};

/**
 * Config
 */
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "app.js",
        path: PUBLIC_PATH,
        publicPath: PUBLIC_PATH
    },
    mode: NODE_ENV,
    optimization: {
        minimizer: [optimizationTerser]
    },
    plugins: PRODUCTION_ENABLED
        ? [pluginEnv, pluginVue, pluginExtractCss]
        : [pluginEnv, pluginVue, pluginExtractCss],
    module: {
        rules: PRODUCTION_ENABLED
            ? [ruleVue, ruleScss, ruleBabel]
            : [ruleVue, ruleScss]
    },
    devtool: PRODUCTION_ENABLED ? "" : "cheap-module-source-map"
};
