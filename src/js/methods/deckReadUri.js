"use strict";

import uriDeckDecode from "./uriDeckDecode";
import deckUnique from "./deckUnique";
import apiLoadNames from "./apiLoadNames";

const deckReadUri = function(uriDeck, cb) {
    const deckList = uriDeckDecode(uriDeck);
    const deckUniqueCards = deckUnique(deckList);

    apiLoadNames(deckUniqueCards, cb);

    const result = {
        link: uriDeck,
        unique: deckUniqueCards,
        list: deckList
    };

    return result;
};

export default deckReadUri;
