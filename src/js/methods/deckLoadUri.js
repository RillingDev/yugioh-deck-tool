"use strict";

import uriDeckDecode from "./lib/uriDeckDecode";

const deckLoadUri = function (uriDeck) {
    const vm = this;
    const deckArray = uriDeckDecode(uriDeck);

    vm.deck.name = deckArray[0];
    vm.deck.list = deckArray[1];
    vm.deckUpdate(uriDeck);
};

export default deckLoadUri;
