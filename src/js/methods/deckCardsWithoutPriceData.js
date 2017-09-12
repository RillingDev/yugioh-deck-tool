import utilEachObject from "./lib/utilEachObject";

const deckCardsWithoutPriceData = function () {
    const vm = this;
    const data = vm.cards.data;
    const result = [];

    utilEachObject(vm.deck.list, deckpart => {
        deckpart.forEach(cardId => {
            if (!result.includes(cardId) && (data[cardId] && !data[cardId].price)) {
                result.push(cardId);
            }
        });
    });

    return result;
};

export default deckCardsWithoutPriceData;
