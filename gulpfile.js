"use strict";

const gulp = require("gulp");
const task_html = require("./tasks/html");
const task_js = require("./tasks/js");
const task_js_dist = require("./tasks/js-dist");
const task_css = require("./tasks/css");
const task_bootstrap = require("./tasks/bootstrap");
const task_connect = require("./tasks/connect");
//const task_electron = require("./tasks/electron");

gulp.task("html", [], task_html);
gulp.task("js", [], task_js);
gulp.task("js-dist", [], task_js_dist);
gulp.task("css", task_css);
gulp.task("bootstrap", task_bootstrap);
gulp.task("connect", [], task_connect);
//gulp.task("electron", [], task_electron);


gulp.task("watch", function () {
    gulp.watch("./src/**/*.pug", ["html"]);
    gulp.watch(["./src/scss/**/*.scss"], ["css"]);
    gulp.watch(["./src/scss/bootstrap.scss", "./src/scss/_variables.scss"], ["bootstrap", "css"]);
    gulp.watch(["./src/js/**/*.js"], ["js"]);
});

gulp.task("dev", ["connect", "watch"]);
gulp.task("build", ["html", "js", "bootstrap", "css"]);
gulp.task("dist", ["html", "js-dist", "bootstrap", "css"]);
gulp.task("default", ["dist"]);
