"use strict";

/**
 * Builds & Copies Bootstrap
 */

const gulp = require("gulp");
const sass = require("gulp-sass");
const cssBeautify = require("gulp-cssbeautify");

module.exports = function() {
    gulp
        .src(["./src/scss/bootstrap.scss", "./src/scss/_variables.scss"])
        .pipe(gulp.dest("./node_modules/bootstrap/scss"));

    return gulp
        .src("./node_modules/bootstrap/scss/bootstrap.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(cssBeautify())
        .pipe(gulp.dest("./app/css/lib/"));
};
