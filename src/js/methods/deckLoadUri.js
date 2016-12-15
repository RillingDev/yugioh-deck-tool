"use strict";

import uriDeckDecode from "./uriDeckDecode";
import deckUnique from "./deckUnique";

const deckLoadUri = function(uriDeck) {
    const vm = this;
    const deckList = uriDeckDecode(uriDeck);

    vm.deck.list = deckList;
    vm.deck.link = uriDeck;
    vm.cards.unique = deckUnique(deckList);
};

export default deckLoadUri;
