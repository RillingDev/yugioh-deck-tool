import Deck from "./classes/deck";
import shuffle from "./shuffle";
import { DECKPARTS } from "./data/deck";

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
    const addCardRandomAmount = (arr, card, limit, preferPlayset = true) => {
        const cardAmountMaxFromBanlist = card[1][12];
        let cardAmountRandom = getRandomAmount(preferPlayset);

        if (cardAmountRandom > cardAmountMaxFromBanlist) {
            cardAmountRandom = cardAmountMaxFromBanlist;
        }
        if (arr.length + cardAmountRandom > limit) {
            cardAmountRandom = limit - arr.length;
        }

        if (cardAmountRandom > 0) {
            resultCardNames.push(card[1][1]);

            return [...arr, ...new Array(cardAmountRandom).fill(card[0])];
        }

        return arr;
    };
    const pairsShuffled = shuffle(cardDb.pairsArr.slice(0, 100)); //shuffle(cardDb.pairsArr.filter(filter));
    const result = [[], [], []];
    const resultCardNames = [];
    let i = 0;
    let mainDeckCountSpells = 0;
    let mainDeckCountTraps = 0;

    // eslint-disable-next-line no-console
    console.log(pairsShuffled);

    while (
        (result[0].length < deckParts[0].min ||
            result[1].length < deckParts[1].max ||
            result[2].length < deckParts[2].max) &&
        i < pairsShuffled.length
    ) {
        const card = pairsShuffled[i];

        if (
            deckParts[0].check(card[1]) &&
            result[0].length < deckParts[0].min
        ) {
            /**
             * Main
             */
            const isSpell = card[1][1] === "Spell Card";
            const isTrap = card[1][1] === "Trap Card";

            console.log({ mainDeckCountSpells, mainDeckCountTraps });

            if (
                (!isSpell || mainDeckCountSpells < MAX_SPELLS) &&
                (!isTrap || mainDeckCountTraps < MAX_TRAPS)
            ) {
                const prevLength = result[0].length;

                result[0] = addCardRandomAmount(
                    result[0],
                    card,
                    deckParts[0].min
                );

                if (isSpell) {
                    mainDeckCountSpells += result[0].length - prevLength;
                } else if (isTrap) {
                    mainDeckCountTraps += result[0].length - prevLength;
                }
            }
        } else if (
            deckParts[1].check(card[1]) &&
            result[1].length < deckParts[1].max
        ) {
            /**
             * Extra
             */
            result[1] = addCardRandomAmount(
                result[1],
                card,
                deckParts[1].max,
                false
            );
        } else if (
            deckParts[2].check(card[1]) &&
            result[2].length < deckParts[2].max
        ) {
            /**
             * Side
             */
            result[2] = addCardRandomAmount(
                result[2],
                card,
                deckParts[2].max,
                false
            );
        }

        i++;
    }
    /*  deckParts.forEach(deckPart => {
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
                (!isSpell || countSpells < MAX_SPELLS) &&
                (!isTrap || countTraps < MAX_TRAPS)
            ) {
                if (deckPart.check(card[1])) {
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
                } else {
                }
            }

            i++;
        }

        result.push(subResult.slice(0, deckPartLimit));
    }); */

    console.log(result);

    return new Deck(result, getRandomName(resultCardNames)).sort(cardDb);
};

export default randomizeDeck;
