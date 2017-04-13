"use strict";

/**
 * Compile Jade/Pug to HTML
 */

const gulp = require("gulp");
const pug = require("gulp-pug");
const prettify = require("gulp-html-prettify");

module.exports = function () {
    return gulp
        .src("./src/index.pug")
        .pipe(pug())
        .pipe(prettify({
            indent_char: " ",
            indent_size: 4
        }))
        .pipe(gulp.dest("./app"));
};
