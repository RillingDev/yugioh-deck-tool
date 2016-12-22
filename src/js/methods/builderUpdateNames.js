"use strict";

const builderUpdateNames = function() {
    const vm = this;
    const filter = vm.builder.filter.toLowerCase();

    vm.builder.pairsFiltered = vm.cards.pairs.filter(card => {
        return card[1].toLowerCase().indexOf(filter) !== -1;
    });
};

export default builderUpdateNames;
