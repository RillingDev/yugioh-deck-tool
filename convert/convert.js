"use strict";

const fs = require("fs");
const deflate = require("zlib").deflateSync;
const input = require("./input.json");
const { isString } = require("lightdash");

const inputCards = input[2].data;
const output = {};

const normalize = val => (isString(val) ? val.trim() : "");

const splitLinkMarkers = val =>
    val ? val.split(",").map(str => str.trim()) : [];

const banlistToNumber = val => {
    if (val === "Banned") return 0;
    else if (val === "Limited") return 1;
    else if (val === "Semi-Limited") return 2;
    return 3;
};

const types = new Set();

inputCards.forEach(entry => {
    if (entry.name.length > 0 && !entry.type.startsWith("Token")) {
        if (!types.has(entry.type)) {
            types.add(entry.type);
        }
        output[entry.id] = [
            normalize(entry.name),

            normalize(entry.type),
            normalize(entry.atk),
            normalize(entry.def),
            normalize(entry.level),
            normalize(entry.race),
            normalize(entry.attribute),
            splitLinkMarkers(entry.linkmarkers),

            normalize(entry.times),
            normalize(entry.rating_up),
            normalize(entry.rating_down),

            normalize(entry.format),
            banlistToNumber(entry.ban_tcg),
            banlistToNumber(entry.ban_ocg)
        ];
    }
});

fs.writeFileSync(
    "./out/debug_types.json",
    JSON.stringify(Array.from(types).sort(), null, "  "),
    "utf8"
);
fs.writeFileSync(
    "./out/debug_names.json",
    JSON.stringify(output, null, "  "),
    "utf8"
);
fs.writeFileSync(
    "./out/names.json.gz",
    deflate(JSON.stringify(output)),
    "binary"
);
