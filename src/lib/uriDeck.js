import {
    compress,
    decompress
} from "./compress";
import {
    objValues,
    arrClone,
    arrCount,
} from "lightdash";

const optimizerDelimiters = [
    "|", // DeckParts
    ";", // CardIds
    "*" // CardAmount
];

const createOptimizeList = deckList => objValues(deckList)
    .map(deckListPart => arrClone(arrCount(deckListPart))
        .map(entry => {
            if (entry[1] > 1) {
                return `${optimizerDelimiters[2]}${entry[1]}${entry[0]}`;
            } else {
                return entry[0];
            }
        })
        .join(optimizerDelimiters[1]))
    .join(optimizerDelimiters[0]);

const loadOptimizedList = str => str.split(optimizerDelimiters[0])
    .map(deckListPart => {
        const result = [];

        deckListPart
            .split(optimizerDelimiters[1])
            .map(entry => {
                if (entry.startsWith(optimizerDelimiters[2])) {
                    const arrSized = Array(Number(entry[1]));

                    // Creates a new array of the size of cards, and fills with the card id
                    result.push(...arrSized.fill(entry.slice(2)));
                } else {
                    result.push(entry);
                }
            });

        return result;
    });

const uriDeckEncode = deckList => {
    const optimized = createOptimizeList(deckList);

    return optimized !== optimizerDelimiters[0].repeat(2) ? compress(optimized) : "";
};

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
