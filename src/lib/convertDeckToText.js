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
                .map(entry => `${cardData.get(entry[0])} x${entry[1]}`);

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
