"use strict";

import {
    priceAPI
} from "../data/apiURLs";
//import utilEachObject from "./utilEachObject";

const apiLoadPrices = function() {
    const vm = this;
    const uniqueNames = vm.deck.unique.map(id => {
        if (vm.cards.data[id]) {
            return vm.cards.data[id].name;
        } else {
            return false;
        }
    });
    const priceQuery = btoa(JSON.stringify(uniqueNames));

    vm.ajax.currentlyLoading = true;
    vm.ajax.pricesLoaded = false;

    fetch(priceAPI + priceQuery)
        .then(response => {
            return response.json();
        })
        .then(function(json) {
            vm.deck.unique.forEach((id, index) => {
                const priceData = json[index];

                vm.cards.data[id].price = {
                    low: priceData.low,
                    average: priceData.average,
                    high: priceData.high
                };
            });

            vm.ajax.currentlyLoading = false;
            vm.ajax.pricesLoaded = true;
        });
};

export default apiLoadPrices;
