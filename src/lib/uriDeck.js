import { compress, decompress } from "./compress";
import { arrFrom, arrCount } from "lightdash";

const DELIMITERS = {
    deckPart: "|",
    cardId: ";",
    cardAmount: "*"
};

const createOptimizeList = deckList =>
    deckList
        .map(deckListPart =>
            arrFrom(arrCount(deckListPart))
                .map(entry => {
                    if (entry[1] > 1) {
                        return `${DELIMITERS.cardAmount}${entry[1]}${entry[0]}`;
                    } else {
                        return entry[0];
                    }
                })
                .join(DELIMITERS.cardId)
        )
        .join(DELIMITERS.deckPart);

const loadOptimizedList = str =>
    str.split(DELIMITERS.deckPart).map(deckListPart => {
        const result = [];

        if (deckListPart.length > 0) {
            deckListPart.split(DELIMITERS.cardId).map(entry => {
                if (entry.startsWith(DELIMITERS.cardAmount)) {
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

    return optimized !== DELIMITERS.deckPart.repeat(2)
        ? compress(optimized)
        : "";
};

const uriDeckDecode = deckUri => loadOptimizedList(decompress(deckUri));

export { uriDeckEncode, uriDeckDecode };
