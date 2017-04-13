"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");

module.exports = function () {
    return gulp
        .src("./src/scss/bootstrap.scss")
        .pipe(sass({outputStyle: "expanded"})
        .on("error", sass.logError))
        .pipe(gulp.dest("./app/css/lib"));
};
