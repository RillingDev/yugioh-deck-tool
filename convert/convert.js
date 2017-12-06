"use strict";

const fs = require("fs");
const pako = require("pako");
const pakoOptions = {
    to: "string"
};
const input = require("./input.json");
const inputCards = input[2].data;
const output = {};
let outputJSON;
let outputJSONCompressed;

inputCards.forEach(entry => {
    output[entry.id] = {
        name: entry.name,
        nameBeta: entry.betaname,
        set: entry.cardset,

        type: entry.type,

        atk: entry.atk,
        def: entry.def,
        type: entry.type,
        race: entry.race,
        attribute: entry.attribute,

        times: entry.times,
        timesWeek: entry.timesperweek,

        ratingUp: entry.rating_up,
        ratingDown: entry.rating_down
    };
});

outputJSON = JSON.stringify(output, null, "");
outputJSONCompressed = pako.deflate(outputJSON);

fs.writeFileSync("./names.json.gz", outputJSONCompressed);
