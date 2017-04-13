"use strict";

const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const rollup = require("rollup-stream");
const nodeResolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const uglify = require("rollup-plugin-uglify");
const replace = require("rollup-plugin-replace");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const packageJson = require("../package.json");

module.exports = function () {
    const rollupOptions = {
        entry: "./src/js/app.js",
        format: "iife",
        sourceMap: true,
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
    };

    return rollup(rollupOptions)
        .pipe(source("app.js", "./src/js/"))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./app/js/"));
};
