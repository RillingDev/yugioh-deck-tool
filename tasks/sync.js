"use strict";

const gulp = require("gulp");
const sync = require("gulp-config-sync");

module.exports = function() {
    return gulp.src("./app/package.json")
        .pipe(sync({
            fields: [
                "name",
                "version",
                "description",
                "repository",
                "keywords",
                "author",
                "license",
                "bugs",
                "homepage"
            ]
        }))
        .pipe(gulp.dest("./app/"));
};
