const builderDeckRemove = function (id, part) {
    const vm = this;
    let foundCard = false;

    vm.deck.list[part] = vm.deck.list[part].filter(cardId => {
        if (!foundCard) {
            if (id === cardId) {
                foundCard = true;
                return false;
            }
        }
        return true;
    });
    vm.deckUpdate();
};

export default builderDeckRemove;
