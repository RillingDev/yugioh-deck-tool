"use strict";

/* eslint no-console: "off" */
const pug = require("pug");
const pretty = require("pretty");
const fs = require("fs");
const CONSTANTS = require("../package.json").constants;

const result = pug.compileFile(`${CONSTANTS.dirBase.input}/${CONSTANTS.html.input}.pug`)();

fs.writeFile(
    `${CONSTANTS.dirBase.output}/${CONSTANTS.html.output}.html`,
    result,
    err => {
        if (err) {
            console.log(err);
        } else {
            console.log("HTML complete");
        }
    }
);
