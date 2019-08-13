import Deck from "./deck";
import { DECKPARTS } from "../data/deck";
import { randShuffle, randNumber } from "lightdash";

const REGEX_NAME_DELIMITER = /\s?[,;:\- ]?\s/;
const IGNORED_WORDS = ["of", "the", "a", "an", "in"];

const getRandomAmount = (preferPlayset = true) => {
    const seed = Math.random();

    if (preferPlayset) {
        if (seed > 0.65) return 1;
        else if (seed > 0.5) return 2;
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
        .slice(0, randNumber(2, 3))
        .join(" ")
        .trim();
};

const randomizeDeck = (cardDb, getPools) => {
    const deckpartHasSpace = deckpartIndex =>
        result[deckpartIndex].length <
        (deckpartIndex === 0 ? DECKPARTS[0].min : DECKPARTS[deckpartIndex].max);

    const deckpartCanAdd = (card, deckpartIndex) =>
        deckpartHasSpace(deckpartIndex) &&
        DECKPARTS[deckpartIndex].check(card[1]) &&
        card[1].type != "Skill Card";
    const fillDeck = (subResult, pool, ratios = null) => {
        let i = 0;

        while (
            (deckpartHasSpace(0) ||
                deckpartHasSpace(1) ||
                deckpartHasSpace(1)) &&
            i < pool.length
        ) {
            const card = pool[i];

            if (deckpartCanAdd(card, 0)) {
                const seed = Math.random();
                const isSpell = card[1].type === "Spell Card";
                const isTrap = card[1].type === "Trap Card";
                const isMonster = !isTrap && !isSpell;

                if (
                    !names.has(card[1].name) &&
                    !names.has(card[1].treatedAs) &&
                    (ratios === null ||
                        (isSpell && seed < ratios.spell) ||
                        (isTrap && seed < ratios.trap) ||
                        (isMonster && seed < ratios.monster))
                ) {
                    const prevLength = subResult[0].length;

                    subResult[0] = addCardRandomAmount(
                        subResult[0],
                        card,
                        DECKPARTS[0].min
                    );

                    names.add(card[1].name);
                    if (card[1].treatedAs) names.add(card[1].treatedAs);

                    if (subResult[0].length - prevLength === 3) {
                        resultCardNames.push(card[1].name);
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
    const pools = getPools(cardDb.pairsArr);
    const resultCardNames = [];
    const names = new Set();
    let result = [[], [], []];

    pools.required = randShuffle(pools.required);
    pools.main = randShuffle(pools.main);

    result = fillDeck(result, pools.required);
    result = fillDeck(result, pools.main, pools.ratios);

    return new Deck(result, getRandomName(resultCardNames)).sort(cardDb);
};

export { randomizeDeck, getRandomName, getRandomAmount };
