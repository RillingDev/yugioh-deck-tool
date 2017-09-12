import utilEachObject from "./lib/utilEachObject";

const priceForSection = function (section, mode) {
    const priceSum = function (arr) {
        let result = 0;

        if (arr && arr.length > 0) {
            arr.forEach(id => {
                const cardData = vm.cards.data[id];
                if (cardData && cardData.price && cardData.price[mode]) {
                    result += cardData.price[mode];
                }
            });
        }

        return result;
    };
    const vm = this;
    let price = 0;

    if (section === "*") {
        utilEachObject(vm.deck.list, deckpart => {
            price += priceSum(deckpart);
        });
    } else {
        price = priceSum(vm.deck.list[section]);
    }

    return vm.priceConvert(price);
};

export default priceForSection;
