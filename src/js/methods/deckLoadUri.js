"use strict";

import uriDeckDecode from "./uriDeckDecode";

const deckLoadUri = function(uriDeck) {
    const vm = this;
    const deckList = uriDeckDecode(uriDeck);

    vm.deck.list = deckList;
    vm.deckUpdate(deckList, uriDeck);
};

export default deckLoadUri;
