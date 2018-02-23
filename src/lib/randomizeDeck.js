import Deck from "./classes/deck";
import shuffle from "./shuffle";

const REGEX_NAME_DELIMITER = /[,;:]? (?:- )?/;

const getRandomAmount = () => {
    const seed = Math.random();

    if (seed > 0.85) return 1;
    else if (seed > 0.6) return 2;
    else return 3;
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

        while (subResult.length < deckPartLimit && i < pairsShuffled.length) {
            const card = pairsShuffled[i];

            if (deckPart.check(card[1])) {
                const cardByAmount = new Array(getRandomAmount()).fill(card[0]);

                subResult.push(...cardByAmount);

                if (deckPart.id !== "side") {
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
