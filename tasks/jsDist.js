"use strict";

const path = require("path");
const bundle = require("./lib/bundle");
const commonjs = require("rollup-plugin-commonjs");
const replace = require("rollup-plugin-replace");
const vue = require("rollup-plugin-vue");
const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");
const uglify = require("rollup-plugin-uglify-es");
const CONSTANTS = require("../package.json").constants;

const optionsBabel = {
    presets: [
        ["env", {
            modules: false,
            targets: CONSTANTS.js.targets,
        }]
    ],
    plugins: [
        "external-helpers"
    ]
};

bundle([{
    type: "iife",
    ext: ""
}], [
    resolve({
        jsnext: true,
        main: true
    }),
    commonjs(),
    vue({
        css: path.join(CONSTANTS.dirBase.output, `${CONSTANTS.css.output}.css`),
        compileTemplate: true,
        compileOptions: {
            preserveWhitespace: false
        }
    }),
    replace({
        "process.env.NODE_ENV": JSON.stringify("production")
    }),
    babel(optionsBabel),
    uglify()
]);
