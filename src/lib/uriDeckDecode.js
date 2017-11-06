import {
    decompress
} from "./compress";

const loadOptimizedList = str => str.split("|")
    .map(deckListPart => {
        const result = [];

        deckListPart
            .split("+")
            .map(entry => {
                if (entry.startsWith("x")) {
                    // Creates a new array of the size of cards, and fills with the card id
                    result.push(...Array(Number(entry[1])).fill(entry.slice(2)));
                } else {
                    result.push(entry);
                }
            });

        return result;
    });

const uriDeckDecode = function (deckParts, deckUri) {
    const deckArray = loadOptimizedList(decompress(deckUri));
    const deckList = {};

    deckParts.forEach((deckPart, index) => {
        deckList[deckPart.id] = deckArray[index];
    });

    return deckList;
};

export default uriDeckDecode;
