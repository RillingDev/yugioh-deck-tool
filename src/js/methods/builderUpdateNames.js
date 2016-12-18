"use strict";

const builderUpdateNames = function() {
    const vm = this;

    vm.cards.filteredNames = vm.cards.names.filter(str => {
        return str.indexOf(vm.cards.filter) !== -1;
    });
};

export default builderUpdateNames;
