import {
    arrCount,
    arrClone
} from "lightdash";

const convertDeckToText = function (deckParts, cardData, deck) {
    const result = [];

    deckParts.forEach(deckPart => {
        const deckPartCards = deck.list[deckPart.id];

        if (deckPartCards.length > 0) {
            const deckPartCardsCounted = arrClone(arrCount(deckPartCards).entries())
                .map(entry => {
                    const cardName = cardData.has(entry[0]) ? cardData.get(entry[0]) : `[${entry[0]}]`;

                    return `${cardName} x${entry[1]}`;
                });

            result.push(
                `${deckPart.name}:`,
                ...deckPartCardsCounted,
                ""
            );
        }
    });

    return result.join("\n").trim();
};

export default convertDeckToText;
