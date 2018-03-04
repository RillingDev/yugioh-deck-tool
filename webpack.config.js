const NODE_ENV = process.env.NODE_ENV;
const PRODUCTION_ENABLED = NODE_ENV === "production";
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
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
});
const pluginUglify = new UglifyJsPlugin({
    cache: path.join(CACHE, "uglifyjs/"),
    sourceMap: true
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
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "app.js"
    },
    mode: NODE_ENV,
    plugins: PRODUCTION_ENABLED
        ? [pluginEnv, pluginUglify, pluginExtractText]
        : [pluginEnv, pluginExtractText],
    module: {
        rules: PRODUCTION_ENABLED
            ? [ruleVue, ruleExtractText, ruleEslint, ruleBabel]
            : [ruleVue, ruleExtractText]
    }
};
