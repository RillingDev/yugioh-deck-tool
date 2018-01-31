"use strict";

const fs = require("fs");
const deflate = require("zlib").deflateSync;
const input = require("./input.json");
const inputCards = input[2].data;
const output = {};

inputCards.forEach(entry => {
    entry.linkmarkers = entry.linkmarkers ?
        entry.linkmarkers.split(",").map(str => str.trim()) :
        [];

    output[entry.id] = [
        entry.name,

        entry.type,
        entry.atk,
        entry.def,
        entry.level,
        entry.race,
        entry.attribute,
        entry.linkmarkers,

        entry.times,
        entry.rating_up,
        entry.rating_down,
        entry.pkey
    ];
});

fs.writeFileSync(
    "./out/names.json",
    JSON.stringify(output, null, "  "),
    "utf8"
);
fs.writeFileSync(
    "./out/names.json.gz",
    deflate(JSON.stringify(output)),
    "binary"
);
