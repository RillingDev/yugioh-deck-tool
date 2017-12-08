"use strict";

const fs = require("fs");
const deflate = require("zlib").deflateSync;
const input = require("./input.json");
const inputCards = input[2].data;
const output = {};
let outputJSON;

inputCards.forEach(entry => {
    output[entry.id] = [
        entry.name,
        entry.betaname,
        entry.cardset,

        entry.type,
        entry.atk,
        entry.def,
        entry.level,
        entry.race,
        entry.attribute,

        entry.times,
        entry.rating_up,
        entry.rating_down,
        entry.pkey
    ];
});

outputJSON = JSON.stringify(output, null, "");

//fs.writeFileSync("./names.json", outputJSON, "utf8");
fs.writeFileSync("./names.json.gz", deflate(outputJSON), "binary");
