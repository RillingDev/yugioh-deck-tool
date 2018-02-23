import Deck from "./classes/deck";
import shuffle from "./shuffle";

const getRandomAmount = () => {
    const seed = Math.random();

    if (seed > 0.85) return 1;
    else if (seed > 0.6) return 2;
    else return 3;
};

const getRandomName = cardNameList => {
    const words = cardNameList.join(" ").split(" ");

    return shuffle(words)
        .slice(0, 3)
        .join(" ");
};

const randomizeDeck = (pairsArr, deckParts, deckCardCanAdd) => {
    const pairsShuffled = shuffle(pairsArr);
    const result = [];
    const resultCardNames = [];
    let i = 0;

    deckParts.forEach(deckPart => {
        const subResult = [];
        const deckPartLimit = deckPart.min === 0 ? deckPart.max : deckPart.min;

        while (subResult.length < deckPartLimit && i < pairsShuffled.length) {
            const card = pairsShuffled[i];

            if (deckCardCanAdd(deckPart, card[0])) {
                const cardByAmount = new Array(getRandomAmount()).fill(card[0]);

                subResult.push(...cardByAmount);
                resultCardNames.push(card[1][0]);
            }
            i++;
        }

        result.push(subResult.slice(0, deckPart.max));
    });

    return new Deck(result, getRandomName(resultCardNames));
};

export default randomizeDeck;
