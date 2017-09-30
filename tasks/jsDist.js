"use strict";

const nodeResolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const replace = require("rollup-plugin-replace");
const babel = require("babel-core");
const uglify = require("uglify-es");
const bundle = require("./lib/bundle");

const OPTIONS_BABEL = {
    compact: false,
    ast: false,
    presets: [
        ["env", {
            targets: {
                browsers: "chrome >= 58",
            }
        }]
    ]
};

bundle([{
    id: "iife",
    ext: "",
    name: "IIFE:min",
    fn: code => uglify.minify(babel.transform(code, OPTIONS_BABEL).code).code
}], [
    nodeResolve({
        jsnext: true,
        main: true
    }),
    commonjs(),
    replace({
        "process.env.NODE_ENV": JSON.stringify("production")
    })
]);
