"use strict";

import deckUnique from "./deckUnique";
import uriDeckEncode from "./uriDeckEncode";

const deckUpdate = function(deckList, deckLink) {
    const vm = this;

    vm.deck.link = deckLink || uriDeckEncode(deckList);
    vm.deck.unique = deckUnique(deckList);
    vm.ajax.pricesLoaded = false;
};

export default deckUpdate;
