import { arrUniq } from "lightdash";

const apiLoadPrices = (urls, deckListAll, cardDb, priceDb) =>
    new Promise((resolve, reject) => {
        const cardsWithoutData = priceDb.getCardsWithoutData(
            arrUniq(deckListAll)
        );

        if (cardsWithoutData.length > 0) {
            const cardsWithoutDataNames = cardsWithoutData
                .sort() // Sort to make caching easier
                .map(cardId => encodeURIComponent(cardDb.getName(cardId))); // Encode to avoid unicode-to-b64 issues
            const query = btoa(JSON.stringify(cardsWithoutDataNames));

            fetch(urls.priceAPI + query)
                .then(response => response.json())
                .then(json => {
                    cardsWithoutData.forEach((cardId, index) => {
                        priceDb.set(cardId, json[index]);
                    });

                    resolve(true);
                })
                .catch(reject);
        } else {
            resolve(false);
        }
    });

export default apiLoadPrices;
