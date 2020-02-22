import { compress, decompress } from "../compress";
import { countBy } from "lodash";
import { toMap } from "lightdash";

const DELIMITERS = {
    deckPart: "|",
    cardId: ";",
    cardAmount: "*"
};

const createOptimizeList = deckList =>
    deckList
        .map(deckListPart =>
            Array.from(toMap(countBy(deckListPart)))
                .map(entry =>
                    entry[1] > 1
                        ? `${DELIMITERS.cardAmount}${entry[1]}${String(
                              entry[0]
                          )}`
                        : entry[0]
                )
                .join(DELIMITERS.cardId)
        )
        .join(DELIMITERS.deckPart);

const loadOptimizedList = str =>
    str.split(DELIMITERS.deckPart).map(deckListPart => {
        const result = [];

        if (deckListPart.length > 0) {
            deckListPart.split(DELIMITERS.cardId).forEach(entry => {
                if (entry.startsWith(DELIMITERS.cardAmount)) {
                    const arrSized = Array(Number(entry[1]));

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
