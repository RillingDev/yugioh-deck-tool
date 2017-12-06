import { arrUniq } from "lightdash";

const encodeBase64 = val => btoa(JSON.stringify(val));

const apiLoadPrices = (urls, deckListAll, cardData, priceDataOld) =>
    new Promise((resolve, reject) => {
        const priceData = new Map(priceDataOld);
        const cardIdsToFetch = arrUniq(deckListAll).filter(
            cardId => !priceDataOld.has(cardId)
        );

        if (cardIdsToFetch.length > 0) {
            const priceQuery = encodeBase64(
                cardIdsToFetch.map(cardId => cardData.get(cardId))
            );

            fetch(urls.priceAPI + priceQuery)
                .then(response => response.json())
                .then(json => {
                    cardIdsToFetch.forEach((cardId, index) => {
                        const cardIdPriceData = json[index];

                        priceData.set(cardId, {
                            low: cardIdPriceData.low,
                            average: cardIdPriceData.average,
                            high: cardIdPriceData.high
                        });
                    });

                    resolve(priceData);
                })
                .catch(reject);
        } else {
            resolve(priceData);
        }
    });

export default apiLoadPrices;
