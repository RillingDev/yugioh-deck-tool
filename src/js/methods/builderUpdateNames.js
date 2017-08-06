"use strict";

const builderUpdateNames = function () {
    const vm = this;
    const filter = vm.builder.filter.toLowerCase();
    let result = vm.cards.pairs.filter(card => card[1].toLowerCase().includes(filter));

    if (result.length > 500) {
        result = result.splice(0, 500);
    }

    vm.builder.pairsFiltered = result;
};

export default builderUpdateNames;
