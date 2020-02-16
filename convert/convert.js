const fs = require("fs");
const { deflateSync } = require("zlib");
const input = require("./input.json");

const logger = console;

const normalize = val => (val == null ? "" : val);

const normalizeArray = val =>
    val == null
        ? []
        : val
              .split(",")
              .map(str => str.trim())
              .filter(str => str.length > 0);

const banlistToNumber = val => {
    if (val === "Banned") {
        return 0;
    }
    if (val === "Limited") {
        return 1;
    }
    if (val === "Semi-Limited") {
        return 2;
    }
    return 3;
};

const inputCards = input[2].data;
const output = {};
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
            linkmarkers: normalizeArray(entry.linkmarkers),

            format: normalizeArray(entry.format),
            limit: [
                banlistToNumber(entry.ban_tcg),
                banlistToNumber(entry.ban_ocg)
            ],
            sets: normalizeArray(entry.setcode),

            date: new Date(entry.date).getTime(),
            times: entry.times,
            rating: [entry.rating_up, entry.rating_down],
            treatedAs: entry.treated_as
        };
    }
});

fs.writeFile(
    "out/debug_types.json",
    JSON.stringify(Array.from(types).sort(), null, "  "),
    "utf8",
    () => logger.log("Wrote debug_types")
);
fs.writeFile(
    "./out/debug_names.json",
    JSON.stringify(output, null, "  "),
    "utf8",
    () => logger.log("Wrote debug_names")
);
fs.writeFile("./out/names.min.json", JSON.stringify(output), "utf8", () =>
    logger.log("Wrote names")
);
fs.writeFile(
    "./out/names.min.json.gz",
    deflateSync(JSON.stringify(output)),
    "binary",
    () => logger.log("Wrote names.gz")
);
