"use strict";

const builderDeckAdd = function(id, part) {
    const vm = this;
    const cardId = Number(id);

    vm.deck.list[part].push(cardId);
    vm.deckUpdate(vm.deck.list);
};

export default builderDeckAdd;
