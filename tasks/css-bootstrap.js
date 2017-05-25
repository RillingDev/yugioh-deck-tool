"use strict";

const sass = require("node-sass");
const saveOutput = require("./lib/saveOutput");
const {
    DIR_SRC,
    DIR_DIST
} = require("./lib/constants");

sass.render({
    file: `${DIR_SRC}/scss/bootstrap.scss`,
    outputStyle: "expanded"
}, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        saveOutput(`${DIR_DIST}/css/lib/bootstrap.css`, result.css, "CSS:Bootstrap");
    }
});
