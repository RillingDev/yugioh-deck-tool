"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");

module.exports = function () {
    return gulp
        .src("./src/scss/app.scss")
        .pipe(sass({outputStyle: "expanded"})
        .on("error", sass.logError))
        .pipe(gulp.dest("./app/css"));
};
