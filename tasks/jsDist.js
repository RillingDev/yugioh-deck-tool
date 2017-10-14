"use strict";

const bundle = require("./lib/bundle");
const commonjs = require("rollup-plugin-commonjs");
const replace = require("rollup-plugin-replace");
const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");
const uglify = require("rollup-plugin-uglify-es");
const targets = require("../package.json").constants.js.targets;

const options_babel = {
    presets: [
        ["env", {
            modules: false,
            targets,
        }]
    ],
    plugins: [
        "external-helpers"
    ]
};

bundle([{
    id: "iife",
    ext: "",
    name: "IIFE:min",
}], [
    resolve({
        jsnext: true,
        main: true
    }),
    commonjs(),
    replace({
        "process.env.NODE_ENV": JSON.stringify("production")
    }),
    babel(options_babel),
    uglify()
]);
