"use strict";

const fs = require("fs");
const deflate = require("zlib").deflateSync;
const input = require("./input.json");
const inputCards = input[2].data;
const output = {};

inputCards.forEach(entry => {
    output[entry.id] = [
        entry.name,
        entry.betaname,

        entry.cardset,

        entry.type,

        entry.atk,
        entry.def,
        entry.level,
        entry.type,
        entry.race,
        entry.attribute,

        entry.times,
        entry.rating_up,
        entry.rating_down
    ];
});

fs.writeFileSync(
    "./names.json.gz",
    deflate(JSON.stringify(output, null, "")),
    "binary"
);
