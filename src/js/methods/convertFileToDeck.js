"use strict";

import deckParts from "../data/deckParts";

const convertFileToDeck = function(fileContent) {
    const trim = function(item) {
        return item.length > 2;
    };
    const arr = fileContent.split(/[#!].+/g).filter(trim);
    const result = {};


    //Loop over deck parts
    deckParts.forEach((deckpart, index) => {
        const currentEntry = arr[index];
        let data = [];

        if (currentEntry) {
            data = currentEntry.split("\n").filter(trim).map(card => Number(card));
        }

        result[deckpart.id] = data;
    });

    return result;
};

export default convertFileToDeck;
