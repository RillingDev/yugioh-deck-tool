"use strict";

/* eslint no-console: "off" */
const fs = require("fs");
const path = require("path");
const rollup = require("rollup");
const CONSTANTS = require("../../package.json").constants;

/**
 * Generates and saves bundled file
 *
 * @param {Object} format
 * @param {Object} bundle
 * @returns {Promise}
 */
const createBundle = (format, bundle) => new Promise((resolve, reject) => {
    bundle
        .generate({
            name: CONSTANTS.js.namespace.module,
            format: format.type
        })
        .then(result => {
            fs.writeFile(
                path.join(CONSTANTS.dirBase.output, `${CONSTANTS.js.namespace.file}${format.ext}.js`),
                result.code,
                err => err ? reject(err) : resolve(0)
            );
        })
        .catch(reject);
});

/**
 * Starts rollup and creates multiple bundles
 *
 * @param {Array<Object>} formats
 * @param {Array<Function>} plugins
 */
module.exports = function (formats, plugins) {
    rollup
        .rollup({
            plugins,
            input: path.join(CONSTANTS.dirBase.input, CONSTANTS.js.input),
        })
        .then(bundle => {
            Promise
                .all(formats.map(format => createBundle(format, bundle)))
                .then(() => console.log("Completed bundling"))
                .catch(err => console.error("Bundling error", err));
        })
        .catch(err => console.error("Import errror", err));
};
