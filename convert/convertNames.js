"use strict";

const fs = require("fs");
const input = require("./names_input.json");

const output = {};

input.forEach(entry => {
    output[entry.id] = entry.name;
});

fs.writeFileSync("./names.min.json", JSON.stringify(output));
