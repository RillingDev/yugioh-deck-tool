"use strict";

import uriDeckDecode from "./uriDeckDecode";
import deckUnique from "./deckUnique";
import apiLoadNames from "./apiLoadNames";

const deckReadUri = function(uriDeck) {
    const deckList = uriDeckDecode(uriDeck);
    const deckUniqueCards = deckUnique(deckList);
    const deckData = apiLoadNames(deckUniqueCards);

    const result = {
        file: "",
        link: uriDeck,
        unique: deckUniqueCards,
        list: deckList,
        data: deckData
    };

    return result;
};

export default deckReadUri;
