"use strict";

const builderUpdateNames = function() {
    const vm = this;
    const filter = vm.builder.filter.toLowerCase();
    let result = [];

    //console.log(vm.cards.names);

    //if (vm.cards.filter.length >= 3) {
    result = vm.cards.names.filter(str => {
        return str.toLowerCase().indexOf(filter) !== -1;
    });
    //}

    vm.builder.filteredNames = result;
};

export default builderUpdateNames;
