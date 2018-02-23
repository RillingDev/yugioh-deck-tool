import Deck from "./classes/deck";
import shuffle from "./shuffle";

const REGEX_NAME_DELIMITER = /[,;:]? (?:- )?/;

const getRandomAmount = (extra = false) => {
    const seed = Math.random();

    if (extra) {
        if (seed > 0.5) return 1;
        else if (seed > 0.2) return 2;
        return 3;
    } else {
        if (seed > 0.8) return 1;
        else if (seed > 0.7) return 2;
        return 3;
    }
};

const getRandomName = cardNameList => {
    const words = cardNameList
        .join(" ")
        .split(REGEX_NAME_DELIMITER)
        .filter(word => word[0].toUpperCase() === word[0]); // Only use Capitalized words to avoid 'the' and 'of'

    return shuffle(words)
        .slice(0, 3)
        .join(" ");
};

const randomizeDeck = (pairsArr, deckParts) => {
    const pairsShuffled = shuffle(pairsArr);
    const result = [];
    const resultCardNames = [];
    let i = 0;

    deckParts.forEach(deckPart => {
        const subResult = [];
        const deckPartLimit = deckPart.min === 0 ? deckPart.max : deckPart.min;
        const isExtra = deckPart.id === "extra";
        const isSide = deckPart.id === "side";
        const cardCanAdd = isSide ? deckParts[0].check : deckPart.check;

        while (subResult.length < deckPartLimit && i < pairsShuffled.length) {
            const card = pairsShuffled[i];

            if (cardCanAdd(card[1])) {
                const cardAmount = getRandomAmount(isExtra);
                const cardByAmount = new Array(cardAmount).fill(card[0]);

                subResult.push(...cardByAmount);

                if (!isSide && cardAmount === 3) {
                    resultCardNames.push(card[1][0]);
                }
            }

            i++;
        }

        result.push(subResult.slice(0, deckPart.max));
    });

    return new Deck(result, getRandomName(resultCardNames));
};

export default randomizeDeck;
