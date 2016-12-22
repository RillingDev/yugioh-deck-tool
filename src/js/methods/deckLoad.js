"use strict";

import deckParse from "./deckParse";

const deckLoad = function(file) {
    const reader = new FileReader();
    const vm = this;

    reader.onload = e => {
        const fileContent = e.target.result;
        const deckList = deckParse(fileContent);

        vm.deck.list = deckList;
        vm.deckUpdate(deckList);
    };

    reader.readAsText(file);
};

export default deckLoad;
