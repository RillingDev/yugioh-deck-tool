"use strict";

const rollup = require("rollup");
const nodeResolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const replace = require("rollup-plugin-replace");
const packageJson = require("../package.json");

const saveOutput = require("./lib/saveOutput");
const {
    DIR_SRC,
    DIR_DIST
} = require("./lib/constants");

rollup
    .rollup({
        entry: `${DIR_SRC}/js/app.js`,
        plugins: [
            nodeResolve({
                jsnext: true,
                main: true
            }),
            commonjs(),
            replace({
                "process.env.NODE_ENV": JSON.stringify("developement")
            }),
        ]
    })
    .catch(err => {
        console.log(err);
    })
    .then(bundle => {
        const result = bundle.generate({
            moduleName: packageJson.namespace.module,
            format: "iife"
        }).code;

        saveOutput(`${DIR_DIST}/js/app.js`, result, "JS:Dev");
    });
