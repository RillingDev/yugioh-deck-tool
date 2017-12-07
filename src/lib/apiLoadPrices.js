import { arrUniq } from "lightdash";

const apiLoadPrices = (urls, deckListAll, cardDb, priceDb) =>
    new Promise((resolve, reject) => {
        const cardsWithoutData = priceDb.getCardsWithoutData(
            arrUniq(deckListAll)
        );

        if (cardsWithoutData.length > 0) {
            const cardsWithoutDataNames = cardsWithoutData.map(cardId =>
                cardDb.getName(cardId)
            );
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
