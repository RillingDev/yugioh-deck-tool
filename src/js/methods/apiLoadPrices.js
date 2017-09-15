import {
    priceAPI
} from "../data/urls";

const apiLoadPrices = function () {
    const vm = this;
    //Array of unique ids, minus the ones where prices were already loaded
    const cardIds = vm.deckCardsWithoutPriceData();

    if (cardIds.length > 0) {
        const cardNames = cardIds.map(cardId => vm.cards.data[cardId].name);
        const priceQuery = btoa(JSON.stringify(cardNames));

        vm.ajax.currentlyLoading = true;
        vm.ajax.pricesLoaded = false;

        fetch(priceAPI + priceQuery)
            .then(response => {
                return response.json();
            })
            .then(json => {
                cardIds.forEach((id, index) => {
                    const priceData = json[index];
                    const card = vm.cards.data[id];

                    if (card) {
                        card.price = {
                            low: priceData.low,
                            average: priceData.average,
                            high: priceData.high
                        };
                    }
                });

                vm.ajax.currentlyLoading = false;
                vm.ajax.pricesLoaded = true;
            });
    } else {
        vm.ajax.pricesLoaded = true;
    }
};

export default apiLoadPrices;
