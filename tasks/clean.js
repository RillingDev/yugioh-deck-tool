"use strict";

const gulp = require("gulp");
const clean = require("gulp-clean");

module.exports = function() {
    return gulp.src(["./app/js", "./app/css"], {
            read: false
        })
        .pipe(clean());
};
