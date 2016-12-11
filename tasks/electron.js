"use strict";

/**
 * Builds & Copies Bootstrap
 */

const gulp = require("gulp");
const electron = require("gulp-electron");
const packageJson = require("../package.json");

module.exports = function() {
    return gulp.src("")
        .pipe(electron({
            src: "./app",
            packageJson: packageJson,
            release: "./release",
            cache: "./cache",
            version: packageJson.electron.version,
            packaging: true,
            platforms: packageJson.electron.platforms,
            platformResources: {
                darwin: {
                    CFBundleDisplayName: packageJson.name,
                    CFBundleIdentifier: packageJson.name,
                    CFBundleName: packageJson.name,
                    CFBundleVersion: packageJson.version
                },
                win: {
                    "version-string": packageJson.version,
                    "file-version": packageJson.version,
                    "product-version": packageJson.version
                }
            }
        }))
        .pipe(gulp.dest(""));
};
