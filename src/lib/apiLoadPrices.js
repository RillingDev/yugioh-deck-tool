const encodeBase64 = val => btoa(JSON.stringify(val));

const getCardsWithoutPriceData = (deckListAll, priceData) => {
  const result = [];

  deckListAll.forEach(cardId => {
    if (!result.includes(cardId) && !priceData.has(cardId)) {
      result.push(cardId);
    }
  });

  return result;
};

const apiLoadPrices = (urls, deckListAll, cardData, priceDataOld) => new Promise((resolve, reject) => {
  const priceData = new Map(priceDataOld);
  const cardIdsToFetch = getCardsWithoutPriceData(deckListAll, priceDataOld);

  if (cardIdsToFetch.length > 0) {
    const priceQuery = encodeBase64(cardIdsToFetch.map(cardId => cardData.get(cardId)));

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
