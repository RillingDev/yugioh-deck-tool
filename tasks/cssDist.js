"use strict";

/* eslint no-console: "off" */
const sass = require("node-sass");
const fs = require("fs");
const CONSTANTS = require("../package.json").constants;

sass.render({
    file: `${CONSTANTS.dirBase.input}/${CONSTANTS.css.input}.scss`,
    outputStyle: "compressed"
}, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        fs.writeFile(
            `${CONSTANTS.dirBase.output}/${CONSTANTS.css.output}.css`,
            result.css,
            err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("CSS complete");
                }
            }
        );
    }
});
