import { arrUniq } from "lightdash";

const encodeBase64 = val => btoa(JSON.stringify(val));

const apiLoadPrices = (urls, deckListAll, cardDb, priceDb) =>
    new Promise((resolve, reject) => {
        const cardsWithoutData = priceDb.getCardsWithoutData(
            arrUniq(deckListAll)
        );

        if (cardsWithoutData.length > 0) {
            const cardsWithoutDataNames = cardsWithoutData.map(cardId =>
                cardDb.getName(cardId)
            );

            fetch(urls.priceAPI + encodeBase64(cardsWithoutDataNames))
                .then(response => response.json())
                .then(json => {
                    cardsWithoutData.forEach((cardId, index) => {
                        priceDb.setPrice(cardId, json[index]);
                    });

                    resolve(true);
                })
                .catch(reject);
        } else {
            resolve(false);
        }
    });

export default apiLoadPrices;
