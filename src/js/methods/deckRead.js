"use strict";

import deckParse from "./deckParse";
import deckUnique from "./deckUnique";
import uriDeckEncode from "./uriDeckEncode";
import apiLoadNames from "./apiLoadNames";

const deckRead = function(fileContent, cb) {
    const deckList = deckParse(fileContent);
    const deckUniqueCards = deckUnique(deckList);
    const deckShareLink = uriDeckEncode(deckList);

    apiLoadNames(deckUniqueCards, cb);

    const result = {
        link: deckShareLink,
        unique: deckUniqueCards,
        list: deckList
    };

    return result;
};

export default deckRead;
