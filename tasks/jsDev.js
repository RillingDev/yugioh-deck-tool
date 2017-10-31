"use strict";

const path = require("path");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const replace = require("rollup-plugin-replace");
const vue = require("rollup-plugin-vue");
const bundle = require("./lib/bundle");
const CONSTANTS = require("../package.json").constants;

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
        "process.env.NODE_ENV": JSON.stringify("developement")
    })
]);
