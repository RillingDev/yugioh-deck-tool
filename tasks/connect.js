"use strict";

const connect = require("gulp-connect");
const packageJson = require("../package.json");

module.exports = function() {
    return connect.server({
        name: packageJson.name,
        root: "./app",
        livereload: true,
        port: 8000
    });
};
