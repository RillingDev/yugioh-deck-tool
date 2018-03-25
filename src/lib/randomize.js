import Deck from "./classes/deck";
import { DECKPARTS } from "./data/deck";
import { randShuffle, randNumber } from "lightdash";

const REGEX_NAME_DELIMITER = /\s?[,;:\- ]?\s/;

const IGNORED_WORDS = ["of", "the", "a", "an", "for", "with", "in"];

/**
 * Soft limits
 * If the deck currently has less, than MAX_${type}, add more
 * A max of 5 could lead to max of 8 cards that way, as 3 cards can be added at once
 */
const MAX_SPELLS = 18;
const MAX_TRAPS = 6;

const getRandomAmount = (preferPlayset = true) => {
    const seed = Math.random();

    if (preferPlayset) {
        if (seed > 0.7) return 1;
        else if (seed > 0.6) return 2;
        return 3;
    }
    if (seed > 0.25) return 1;
    else if (seed > 0.1) return 2;
    return 3;
};

const addCardRandomAmount = (arr, card, limit, preferPlayset = true) => {
    const cardAmountMaxFromBanlist = card[1].limit[0];
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
        .filter(word => !IGNORED_WORDS.includes(word.toLowerCase()));

    return randShuffle(words)
        .slice(0, randNumber(1, 2))
        .join(" ")
        .trim();
};

const randomizeDeck = (cardDb, getPools) => {
    const deckpartHasSpace = deckpartIndex =>
        result[deckpartIndex].length <
        (deckpartIndex === 0 ? DECKPARTS[0].min : DECKPARTS[deckpartIndex].max);

    const deckpartCanAdd = (card, deckpartIndex) =>
        deckpartHasSpace(deckpartIndex) &&
        DECKPARTS[deckpartIndex].check(card[1]);
    const fillDeck = (subResult, pool, enableTypeLimits = false) => {
        let mainDeckCountSpells = 0;
        let mainDeckCountTraps = 0;
        let i = 0;

        while (
            (deckpartHasSpace(0) ||
                deckpartHasSpace(1) ||
                deckpartHasSpace(1)) &&
            i < pool.length
        ) {
            const card = pool[i];

            if (deckpartCanAdd(card, 0)) {
                const isSpell = card[1].type === "Spell Card";
                const isTrap = card[1].type === "Trap Card";

                if (
                    !enableTypeLimits ||
                    ((!isSpell || mainDeckCountSpells < MAX_SPELLS) &&
                        (!isTrap || mainDeckCountTraps < MAX_TRAPS))
                ) {
                    const prevLength = subResult[0].length;

                    subResult[0] = addCardRandomAmount(
                        subResult[0],
                        card,
                        DECKPARTS[0].min
                    );

                    const cardsAdded = subResult[0].length - prevLength;

                    if (cardsAdded === 3) {
                        resultCardNames.push(card[1].name);
                    }
                    if (enableTypeLimits) {
                        if (isSpell) {
                            mainDeckCountSpells += cardsAdded;
                        } else if (isTrap) {
                            mainDeckCountTraps += cardsAdded;
                        }
                    }
                }
            } else if (deckpartCanAdd(card, 1)) {
                subResult[1] = addCardRandomAmount(
                    subResult[1],
                    card,
                    DECKPARTS[1].max,
                    false
                );
            } else if (deckpartCanAdd(card, 2)) {
                subResult[2] = addCardRandomAmount(
                    subResult[2],
                    card,
                    DECKPARTS[2].max,
                    false
                );
            }

            i++;
        }

        return subResult;
    };
    const pools = getPools(cardDb.pairsArrUniq);
    const resultCardNames = [];
    let result = [[], [], []];

    console.log(pools);

    pools.main = randShuffle(pools.main);
    pools.required = randShuffle(pools.required);

    result = fillDeck(result, pools.required, false);
    result = fillDeck(result, pools.main, true);

    return new Deck(result, getRandomName(resultCardNames)).sort(cardDb);
};

export { randomizeDeck, getRandomName, getRandomAmount };
