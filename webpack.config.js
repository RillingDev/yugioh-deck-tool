const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

const plugins = [
    new ExtractTextPlugin("app.css"),
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
];

if (process.env.NODE_ENV !== "development") {
    plugins.push(new UglifyJsPlugin());
}

const config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./build"),
        publicPath: "/build/",
        filename: "app.js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel-loader"
        }, {
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
                extractCSS: true
            }
        }]
    },
    plugins
};

module.exports = config;
