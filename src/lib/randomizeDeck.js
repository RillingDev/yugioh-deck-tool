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
        return [...arr, ...new Array(cardAmountRandom).fill(card[0])];
    }

    return arr;
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

const randomizeDeck = (cardDb, filter) => {
    const pairsShuffled = shuffle(cardDb.pairsArr.filter(filter));
    const result = [[], [], []];
    const resultCardNames = [];
    let mainDeckCountSpells = 0;
    let mainDeckCountTraps = 0;
    let i = 0;

    while (
        (result[0].length < DECKPARTS[0].min ||
            result[1].length < DECKPARTS[1].max ||
            result[2].length < DECKPARTS[2].max) &&
        i < pairsShuffled.length
    ) {
        const card = pairsShuffled[i];

        if (
            DECKPARTS[0].check(card[1]) &&
            result[0].length < DECKPARTS[0].min
        ) {
            /**
             * Main
             */
            const isSpell = card[1][1] === "Spell Card";
            const isTrap = card[1][1] === "Trap Card";

            if (
                (!isSpell || mainDeckCountSpells < MAX_SPELLS) &&
                (!isTrap || mainDeckCountTraps < MAX_TRAPS)
            ) {
                const prevLength = result[0].length;

                result[0] = addCardRandomAmount(
                    result[0],
                    card,
                    DECKPARTS[0].min
                );

                const cardsAdded = result[0].length - prevLength;

                if (cardsAdded === 3) {
                    resultCardNames.push(card[1][0]);
                }
                if (isSpell) {
                    mainDeckCountSpells += cardsAdded;
                } else if (isTrap) {
                    mainDeckCountTraps += cardsAdded;
                }
            }
        } else if (
            DECKPARTS[1].check(card[1]) &&
            result[1].length < DECKPARTS[1].max
        ) {
            /**
             * Extra
             */
            result[1] = addCardRandomAmount(
                result[1],
                card,
                DECKPARTS[1].max,
                false
            );
        } else if (
            DECKPARTS[2].check(card[1]) &&
            result[2].length < DECKPARTS[2].max
        ) {
            /**
             * Side
             */
            result[2] = addCardRandomAmount(
                result[2],
                card,
                DECKPARTS[2].max,
                false
            );
        }

        i++;
    }

    return new Deck(result, getRandomName(resultCardNames)).sort(cardDb);
};

export default randomizeDeck;
