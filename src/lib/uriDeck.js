import {
    compress,
    decompress
} from "./compress";
import {
    objValues,
    arrClone,
    arrCount,
} from "lightdash";

const optimizerDelimiters = {
    deckPart: "|",
    cardId: ";",
    cardAmount: "*"
};

const createOptimizeList = deckList => objValues(deckList)
    .map(deckListPart => arrClone(arrCount(deckListPart))
        .map(entry => {
            if (entry[1] > 1) {
                return `${optimizerDelimiters.cardAmount}${entry[1]}${entry[0]}`;
            } else {
                return entry[0];
            }
        })
        .join(optimizerDelimiters.cardId))
    .join(optimizerDelimiters.deckPart);

const loadOptimizedList = str => str.split(optimizerDelimiters.deckPart)
    .map(deckListPart => {
        const result = [];

        if (deckListPart.length > 0) {
            deckListPart
                .split(optimizerDelimiters.cardId)
                .map(entry => {
                    if (entry.startsWith(optimizerDelimiters.cardAmount)) {
                        const arrSized = Array(Number(entry[1]));

                        // Creates a new array of the size of cards, and fills with the card id
                        result.push(...arrSized.fill(entry.slice(2)));
                    } else {
                        result.push(entry);
                    }
                });
        }

        return result;
    });

const uriDeckEncode = deckList => {
    const optimized = createOptimizeList(deckList);

    return optimized !== optimizerDelimiters.deckPart.repeat(2) ? compress(optimized) : "";
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
