"use strict";

import deckParse from "./deckParse";
import deckUnique from "./deckUnique";
import uriDeckEncode from "./uriDeckEncode";

const deckLoad = function(file) {
    const reader = new FileReader();
    const vm = this;

    reader.onload = e => {
        const fileContent = e.target.result;
        const deckList = deckParse(fileContent);

        vm.deck.list = deckList;
        vm.deck.link = uriDeckEncode(deckList);
        vm.cards.unique = deckUnique(deckList);
    };

    reader.readAsText(file);
};

export default deckLoad;
