"use strict";

/* eslint no-console: "off" */
const fs = require("fs");
const rollup = require("rollup");

const CONSTANTS = require("../../package.json").constants;

/**
 * Bundles project with given formats
 *
 * @param {Array<Object>} formats
 * @param {Array<Object>} plugins
 */
module.exports = function (formats, plugins) {
    const promises = [];

    rollup
        .rollup({
            plugins,
            input: `${CONSTANTS.dirBase.input}/${CONSTANTS.js.input}.js`,
        })
        .then(bundle => {
            formats.forEach(format => {
                const bundleFormat = new Promise((resolve, reject) => {
                    bundle
                        .generate({
                            name: CONSTANTS.js.namespace.module,
                            format: format.id
                        })
                        .then(result => {
                            const path = `${CONSTANTS.dirBase.output}/${CONSTANTS.js.namespace.file}${format.ext}.js`;

                            fs.writeFile(
                                path,
                                result.code,
                                err => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        console.log(`Completed bundling ${path}`);
                                        resolve();
                                    }
                                }
                            );
                        })
                        .catch(reject);
                });

                promises.push(bundleFormat);
            });

            Promise
                .all(promises)
                .then(() => {
                    return 0;
                })
                .catch(err => {
                    console.log("One or more errors were encountered during generation");
                    console.log(err.message);
                });
        })
        .catch(err => {
            console.log("One or more errors were encountered during bundling");
            console.log(err.message);
        });
};
