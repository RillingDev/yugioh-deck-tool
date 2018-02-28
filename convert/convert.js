"use strict";

const { isString } = require("lightdash");
const fs = require("fs");
const deflate = require("zlib").deflateSync;
const input = require("./input.json");
const inputCards = input[2].data;
const output = {};

const normalize = val => (isString(val) ? val.trim() : "");

inputCards.forEach(entry => {
    if (entry.name.length > 0 && !entry.type.startsWith("Token")) {
        const linkmarkers = entry.linkmarkers
            ? entry.linkmarkers.split(",").map(str => str.trim())
            : [];

        output[entry.id] = [
            normalize(entry.name),

            normalize(entry.type),
            normalize(entry.atk),
            normalize(entry.def),
            normalize(entry.level),
            normalize(entry.race),
            normalize(entry.attribute),
            linkmarkers,

            normalize(entry.times),
            normalize(entry.rating_up),
            normalize(entry.rating_down),

            normalize(entry.format),
            normalize(entry.ban_tcg),
            normalize(entry.bab_ocg)
        ];
    }
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
