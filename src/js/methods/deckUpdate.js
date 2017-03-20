"use strict";

import uriDeckEncode from "./uriDeckEncode";

const deckUpdate = function (deckLink) {
    const vm = this;

    vm.deck.link = deckLink || uriDeckEncode(vm.deck);
    vm.ajax.pricesLoaded = false;
};

export default deckUpdate;