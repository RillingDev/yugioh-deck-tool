"use strict";

/**
 * Compile SCSS
 */

const gulp = require("gulp");
const sass = require("gulp-sass");
const cssBeautify = require("gulp-cssbeautify");

module.exports = function() {
    return gulp
        .src("./src/scss/app.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(cssBeautify())
        .pipe(gulp.dest("./app/css"));
};
