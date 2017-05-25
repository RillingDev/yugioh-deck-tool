"use strict";

const pug = require("pug");
const pretty = require("pretty");
const saveOutput = require("./lib/saveOutput");
const {
    DIR_SRC,
    DIR_DIST
} = require("./lib/constants");

const compiled = pretty(pug.compileFile(`${DIR_SRC}/index.pug`)());

saveOutput(`${DIR_DIST}/index.html`, compiled, "HTML");
