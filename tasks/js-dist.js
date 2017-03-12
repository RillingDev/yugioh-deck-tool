"use strict";

const gulp = require("gulp");
const rollup = require("rollup-stream");
const nodeResolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const replace = require("rollup-plugin-replace");
const babel = require("rollup-plugin-babel");
const uglify = require("rollup-plugin-uglify");
const source = require("vinyl-source-stream");
const packageJson = require("../package.json");

module.exports = function () {
    return rollup({
            entry: "./src/js/main.js",
            format: "iife",
            plugins: [
                nodeResolve({
                    jsnext: true,
                    main: true
                }),
                commonjs(),
                replace({
                    "process.env.NODE_ENV": JSON.stringify("production")
                }),
                babel(),
                uglify()
            ],
            moduleName: packageJson.namespace.module
        })
        .pipe(source("main.js"))
        .pipe(gulp.dest("./app/js/"));
};
