import { arrFrom, arrRemoveIndex } from "lightdash";

/**
 * Chrome seems to have a very weird behavior when trying to shuffle the array that seems to be very un-random.
 * Therefore we use a self-built shuffle
 */
const fisherYatesShuffle = arr => {
    let input = arrFrom(arr);
    const result = [];

    while (result.length < arr.length) {
        const index = Math.floor(Math.random() * input.length);
        const val = input[index];

        result.push(val);
        input = arrRemoveIndex(input, index);
    }

    return result;
};

const simulateStartingHand = (cardListMain, cardsToDraw) =>
    fisherYatesShuffle(cardListMain).slice(0, cardsToDraw);

export default simulateStartingHand;
