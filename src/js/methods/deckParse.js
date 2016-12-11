"use strict";

import deckParts from "../data/deckParts";

const deckParse = function(fileContent) {
    const trim = function(item) {
        return item.length > 2;
    };
    const arr = fileContent.split(/[#!].+/g).filter(trim);
    const result = {};


    //Loop over deck parts
    deckParts.forEach((deckpart, index) => {
        const currentEntry = arr[index];

        //Push if deck has data for deckpart
        if (currentEntry) {
            result[deckpart.id] = currentEntry.split("\n").filter(trim).map(card => Number(card));
        }
    });

    return result;
};

export default deckParse;
