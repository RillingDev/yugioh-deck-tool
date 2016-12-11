"use strict";

/**
 * Copy Favicon/icon
 */

const gulp = require("gulp");

module.exports = function() {
    return gulp
        .src(["./src/img/favicon.png", "./src/img/icon.png"])
        .pipe(gulp.dest("./app"));
};
