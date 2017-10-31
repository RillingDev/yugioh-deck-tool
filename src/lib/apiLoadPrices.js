import {
    forEachEntry,
    objCloneDeep
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

const apiLoadPrices = (urls, deckList, cardData) => new Promise((resolve, reject) => {
    const cardIds = getCardsWithoutPriceData(deckList, cardData);
    const cardDataNew = objCloneDeep(cardData);

    if (cardIds.length > 0) {
        const cardNames = cardIds.map(cardId => cardDataNew[cardId].name);
        const priceQuery = btoa(JSON.stringify(cardNames));

        fetch(urls.priceAPI + priceQuery)
            .then(response => response.json())
            .then(json => {
                cardIds
                    .forEach((id, index) => {
                        const priceData = json[index];
                        const card = cardDataNew[id];

                        if (card) {
                            card.price = {
                                low: priceData.low,
                                average: priceData.average,
                                high: priceData.high
                            };
                        }
                    });

                resolve(cardDataNew);
            })
            .catch(reject);
    } else {
        resolve(false);
    }
});

export default apiLoadPrices;
