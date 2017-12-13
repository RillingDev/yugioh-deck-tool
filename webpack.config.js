const PRODUCTION = process.env.NODE_ENV === "production";
const CACHE = "./.cache/";

const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

/**
 * Plugins
 */
const pluginExtractText = new ExtractTextPlugin("app.css");
const pluginEnv = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
});
const pluginUglify = new UglifyJsPlugin({
    cache: path.join(CACHE, "uglifyjs/")
});

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
const ruleEslint = {
    enforce: "pre",
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "eslint-loader"
};
const ruleBabel = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: {
            cacheDirectory: path.join(CACHE, "babel/")
        }
    }
};

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "app.js"
    },
    plugins: PRODUCTION
        ? [pluginExtractText, pluginEnv, pluginUglify]
        : [pluginExtractText, pluginEnv],
    module: {
        rules: PRODUCTION ? [ruleVue, ruleEslint, ruleBabel] : [ruleVue]
    },
    devtool: PRODUCTION ? "" : "eval-source-map"
};
