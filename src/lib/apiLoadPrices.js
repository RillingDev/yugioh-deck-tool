import {
    forEachEntry,
    mapFromObject
} from "lightdash";

const getCardsWithoutPriceData = function (deckList, priceData) {
    const result = [];

    forEachEntry(deckList, deckpart => {
        deckpart.forEach(cardId => {
            if (!result.includes(cardId) && !priceData.has(cardId)) {
                result.push(cardId);
            }
        });
    });

    return result;
};

const apiLoadPrices = (urls, deckList, cardData, oldPrices) => new Promise((resolve, reject) => {
    const result = new Map(oldPrices);
    const cardIdsToFetch = getCardsWithoutPriceData(deckList, result);

    console.log({
        urls,
        deckList,
        cardData,
        result,
        cardIdsToFetch
    });

    if (cardIdsToFetch.length > 0) {
        const cardNamesToFetch = cardIdsToFetch.map(cardId => cardData.get(cardId).name);
        const priceQuery = btoa(JSON.stringify(cardNamesToFetch));

        console.log({
            cardNamesToFetch,
            priceQuery
        });

        fetch(urls.priceAPI + priceQuery)
            .then(response => response.json())
            .then(json => {
                cardIdsToFetch
                    .forEach((id, index) => {
                        const priceData = json[index];
                        const card = cardData[id];

                        if (card) {
                            result.set(id, {
                                low: priceData.low,
                                average: priceData.average,
                                high: priceData.high
                            });
                        }
                    });

                resolve(result);
            })
            .catch(reject);
    } else {
        resolve(true);
    }
});

export default apiLoadPrices;
