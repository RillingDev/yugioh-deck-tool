"use strict";

const fs = require("fs");
const deflate = require("zlib").deflateSync;
const input = require("./input.json");
const inputCards = input[2].data;
const output = {};

inputCards.forEach(entry => {
    output[entry.id] = {
        name: entry.name,
        nameBeta: entry.betaname,
        set: entry.cardset,

        type: entry.type,

        atk: entry.atk,
        def: entry.def,
        level: entry.level,
        type: entry.type,
        race: entry.race,
        attribute: entry.attribute,

        views: [entry.times, entry.timesperweek],
        rating: [entry.rating_up, entry.rating_down],
        date: entry.date
    };
});

fs.writeFileSync(
    "./names.json.gz",
    deflate(JSON.stringify(output, null, "")),
    "binary"
);
