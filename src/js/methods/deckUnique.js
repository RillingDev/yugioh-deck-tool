"use strict";

import utilEachObject from "./utilEachObject";

const deckUnique = function(deckData) {
    const result = [];

    //push every value to result that doesnt already exist
    utilEachObject(deckData, deckPart => {
        deckPart.forEach(card => {
            if (result.indexOf(card) === -1) {
                result.push(card);
            }
        });
    });

    //return sorted by lowest to highest
    return result.sort((a, b) => a - b);
};


export default deckUnique;
