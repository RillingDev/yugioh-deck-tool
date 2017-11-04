import {
    arrCount,
    arrClone
} from "lightdash";

const convertDeckToText = function (deckparts, cardData, deck) {
    const result = [];

    deckparts.forEach(deckpart => {
        const deckpartCards = deck.list[deckpart.id];

        if (deckpartCards.length > 0) {
            const deckpartCardsCounted = arrClone(arrCount(deckpartCards).entries())
                .map(entry => `${cardData.get(entry[0])} x${entry[1]}`);

            result.push(
                `${deckpart.name}:`,
                ...deckpartCardsCounted,
                ""
            );
        }
    });

    return result.join("\n").trim();
};

export default convertDeckToText;
