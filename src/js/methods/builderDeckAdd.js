"use strict";

const builderDeckAdd = function(name, part) {
    const vm = this;
    const cardId = Number(vm.cards.mapNameToId.get(name));

    vm.deck.list[part].push(cardId);
    vm.deckUpdate(vm.deck.list);
};

export default builderDeckAdd;
