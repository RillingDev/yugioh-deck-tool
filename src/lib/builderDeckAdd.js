/* const builderDeckAdd = function (id, part) {
    const vm = this;
    const cardId = Number(id);
    const deckPart = vm.deck.list[part];
    const deckPartMax = vm.deckparts.find(deckpart => deckpart.id === part).size[1];

    if (deckPart.length < deckPartMax && deckPart.filter(id => id === cardId).length < 3) {
        deckPart.push(cardId);
        vm.deckUpdate();
    }
};

export default builderDeckAdd;
 */
