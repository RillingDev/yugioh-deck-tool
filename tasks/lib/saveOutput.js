"use strict";

const fs = require("fs");

module.exports = function (path, content, name) {
    fs.writeFile(path, content, (err) => console.log(err || `Saved ${name}`));
};
