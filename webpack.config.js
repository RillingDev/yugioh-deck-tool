const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV;
const PRODUCTION_ENABLED = NODE_ENV === "production";
const CACHE = "./.cache/";
const PUBLIC_PATH = path.resolve(__dirname, "./dist/");

/**
 * Plugins
 */
const pluginExtractText = new ExtractTextPlugin("app.css");
const pluginEnv = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
});

/**
 * Optimizations
 */
const optimizationUglify = new UglifyJsPlugin({
    cache: path.join(CACHE, "uglifyjs/"),
    parallel: true,
    sourceMap: true
});

const optimizationCssAssets = new OptimizeCSSAssetsPlugin({});

/**
 * Rules
 */
const ruleVue = {
    test: /\.vue$/,
    loader: "vue-loader",
    options: {
        extractCSS: true
    }
};
const ruleBabel = {
    test: /\.js$/,
    use: {
        loader: "babel-loader",
        options: {
            cacheDirectory: path.join(CACHE, "babel/")
        }
    }
};
const ruleExtractText = {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader"
    })
};

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "app.js",
        path: PUBLIC_PATH,
        publicPath: PUBLIC_PATH
    },
    mode: NODE_ENV,
    optimization: {
        minimizer: [optimizationUglify, optimizationCssAssets]
    },
    plugins: PRODUCTION_ENABLED
        ? [pluginEnv, pluginExtractText]
        : [pluginEnv, pluginExtractText],
    module: {
        rules: PRODUCTION_ENABLED
            ? [ruleVue, ruleExtractText, ruleBabel]
            : [ruleVue, ruleExtractText]
    },
    devtool: PRODUCTION_ENABLED ? "" : "cheap-module-source-map"
};
