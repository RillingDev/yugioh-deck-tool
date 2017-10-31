import {
    forEachEntry
} from "lightdash";

const getCardsWithoutPriceData = function (deckList, cardData) {
    const result = [];

    forEachEntry(deckList, deckpart => {
        deckpart.forEach(cardId => {
            if (!result.includes(cardId) && (cardData[cardId] && !cardData[cardId].price)) {
                result.push(cardId);
            }
        });
    });

    return result;
};

export default getCardsWithoutPriceData;
