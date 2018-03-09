import Deck from "./classes/deck";
import shuffle from "./shuffle";

const REGEX_NAME_DELIMITER = /\s?[,;:\- ]?\s/;

/**
 * Soft limits
 * If the deck currently has less, than MAX_${type}, add more
 * A max of 5 could lead to 7 cards that way
 */
const MAX_SPELLS = 15;
const MAX_TRAPS = 5;

const getRandomAmount = (preferPlayset = true) => {
    const seed = Math.random();

    if (preferPlayset) {
        if (seed > 0.8) return 1;
        else if (seed > 0.65) return 2;
        return 3;
    }
    if (seed > 0.25) return 1;
    else if (seed > 0.1) return 2;
    return 3;
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

const randomizeDeck = (cardDb, filter, deckParts) => {
    const pairsShuffled = shuffle(cardDb.pairsArr.filter(filter));
    const result = [];
    const resultCardNames = [];
    let i = 0;

    // eslint-disable-next-line no-console
    console.log(pairsShuffled);

    deckParts.forEach(deckPart => {
        const subResult = [];
        const deckPartLimit = deckPart.min === 0 ? deckPart.max : deckPart.min;
        const isExtra = deckPart.id === "extra";
        const isSide = deckPart.id === "side";
        let countSpells = 0;
        let countTraps = 0;

        while (subResult.length < deckPartLimit && i < pairsShuffled.length) {
            const card = pairsShuffled[i];
            const isSpell = card[1][1] === "Spell Card";
            const isTrap = card[1][1] === "Trap Card";

            if (
                deckPart.check(card[1]) &&
                (!isSpell || countSpells < MAX_SPELLS) &&
                (!isTrap || countTraps < MAX_TRAPS)
            ) {
                const cardAmount = getRandomAmount(!(isExtra || isSide));
                const cardAmountMax = card[1][12];
                const cardByAmount = new Array(
                    cardAmountMax >= cardAmount ? cardAmount : cardAmountMax
                ).fill(card[0]);

                subResult.push(...cardByAmount);

                if (isSpell) {
                    countSpells += cardAmount;
                } else if (isTrap) {
                    countTraps += cardAmount;
                }

                if (!isSide && cardAmount === 3) {
                    resultCardNames.push(card[1][0]);
                }
            }

            i++;
        }

        result.push(subResult.slice(0, deckPartLimit));
    });

    return new Deck(result, getRandomName(resultCardNames)).sort(cardDb);
};

export default randomizeDeck;
