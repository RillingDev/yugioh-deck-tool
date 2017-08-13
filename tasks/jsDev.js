"use strict";

const nodeResolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const replace = require("rollup-plugin-replace");
const bundle = require("./lib/bundle");

bundle([{
    id: "iife",
    ext: "",
    name: "IIFE",
    fn: code => code
}], [
    nodeResolve({
        jsnext: true,
        main: true
    }),
    commonjs(),
    replace({
        "process.env.NODE_ENV": JSON.stringify("developement")
    })
]);
