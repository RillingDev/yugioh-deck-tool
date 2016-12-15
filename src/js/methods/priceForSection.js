"use strict";

import utilEachObject from "./utilEachObject";

const priceForSection = function(section, mode) {
    const priceSum = function(arr) {
        let result = 0;

        arr.forEach(id => {
            const price = vm.cards.data[id].price[mode];

            if (price) {
                result += price;
            }
        });

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
