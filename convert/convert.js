"use strict";

const fs = require("fs");
const deflate = require("zlib").deflateSync;
const input = require("./input.json");
const { isNil } = require("lightdash");

const inputCards = input[2].data;
const output = {};

const normalize = val => (isNil(val) ? "" : val);

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
        output[entry.id] = [
            /* 0 */ normalize(entry.name),

            /* 1 */ normalize(entry.type),
            /* 2 */ normalize(entry.atk),
            /* 3 */ normalize(entry.def),
            /* 4 */ normalize(entry.level),
            /* 5 */ normalize(entry.race),
            /* 6 */ normalize(entry.attribute),
            /* 7 */ splitLinkMarkers(entry.linkmarkers),

            /* 8 */ normalize(entry.times),
            /* 9 */ normalize(entry.rating_up),
            /* 10 */ normalize(entry.rating_down),

            /* 11 */ normalize(entry.format),
            /* 12 */ banlistToNumber(entry.ban_tcg),
            /* 13 */ banlistToNumber(entry.ban_ocg)
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
