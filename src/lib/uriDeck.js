import {
    compress,
    decompress
} from "./compress";
import {
    objValues,
    arrClone,
    arrCount,
} from "lightdash";

const optimizerDelimiters = ["&", "%", "$"];

const createOptimizeList = deckList => objValues(deckList)
    .map(deckListPart => arrClone(arrCount(deckListPart))
        .map(entry => entry[1] > 1 ? `${optimizerDelimiters[2]}${entry[1]}${entry[0]}` : entry[0])
        .join(optimizerDelimiters[1]))
    .join(optimizerDelimiters[0]);

const loadOptimizedList = str => str.split(optimizerDelimiters[0])
    .map(deckListPart => {
        const result = [];

        deckListPart
            .split(optimizerDelimiters[1])
            .map(entry => {
                if (entry.startsWith(optimizerDelimiters[2])) {
                    // Creates a new array of the size of cards, and fills with the card id
                    result.push(...Array(Number(entry[1])).fill(entry.slice(2)));
                } else {
                    result.push(entry);
                }
            });

        return result;
    });

const uriDeckEncode = deckList => compress(createOptimizeList(deckList));

const uriDeckDecode = function (deckParts, deckUri) {
    const deckArray = loadOptimizedList(decompress(deckUri));
    const deckList = {};

    deckParts.forEach((deckPart, index) => {
        deckList[deckPart.id] = deckArray[index];
    });

    return deckList;
};

export {
    uriDeckEncode,
    uriDeckDecode
};
