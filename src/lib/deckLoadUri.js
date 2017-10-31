const uriDeckDecode = function (deckParts, deckUri) {
    const deckArray = JSON.parse(atob(deckUri.replace("?d=", "")));
    const deckList = {};

    deckParts.forEach((deckpart, index) => {
        deckList[deckpart.id] = deckArray[1][index];
    });

    return [deckArray[0], deckList];
};

const deckLoadUri = function (uriDeck) {
    const vm = this;
    const deckArray = uriDeckDecode(this.deckparts, uriDeck);

    vm.deck.name = deckArray[0];
    vm.deck.list = deckArray[1];
    vm.deckUpdate(uriDeck);
};

export default deckLoadUri;
