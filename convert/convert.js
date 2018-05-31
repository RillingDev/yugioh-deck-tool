"use strict";

const fs = require("fs");
const deflate = require("zlib").deflateSync;
const input = require("./input.json");

const inputCards = input[2].data;
const output = {};

const normalize = val =>
    typeof val === "undefined" || val === null ? "" : val;

const splitLinkMarkers = val =>
    val
        ? val
              .split(",")
              .map(str => str.trim())
              .filter(str => str.length > 0)
        : [];

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
        output[entry.id] = {
            name: normalize(entry.name),

            type: normalize(entry.type),
            race: normalize(entry.race),
            attribute: normalize(entry.attribute),
            stats: [entry.atk, entry.def, entry.level],
            linkmarkers: splitLinkMarkers(entry.linkmarkers),

            format: normalize(entry.format),
            limit: [
                banlistToNumber(entry.ban_tcg),
                banlistToNumber(entry.ban_ocg)
            ],
            sets: ["foo", "bar", "fizz"],

            date: new Date(entry.date).getTime(),
            times: entry.times,
            rating: [entry.rating_up, entry.rating_down]
        };
    }
});

fs.writeFile(
    "./out/debug_types.json",
    JSON.stringify(Array.from(types).sort(), null, "  "),
    "utf8",
    () => "Wrote debug_types"
);
fs.writeFile(
    "./out/debug_names.json",
    JSON.stringify(output, null, "  "),
    "utf8",
    () => "Wrote debug_names"
);
fs.writeFile(
    "./out/names.min.json",
    JSON.stringify(output),
    "utf8",
    () => "Wrote names"
);
fs.writeFile(
    "./out/names.min.json.gz",
    deflate(JSON.stringify(output)),
    "binary",
    () => "Wrote names.gz"
);
