"use strict";

import deckParse from "./deckParse";
import deckUnique from "./deckUnique";
import uriDeckEncode from "./uriDeckEncode";
import apiLoadNames from "./apiLoadNames";

const deckRead = function(fileContent) {
    const deckList = deckParse(fileContent);
    const deckUniqueCards = deckUnique(deckList);
    const deckShareLink = uriDeckEncode(deckList);
    const deckData = apiLoadNames(deckUniqueCards);
    const result = {
        link: deckShareLink,
        file: fileContent,
        unique: deckUniqueCards,
        list: deckList,
        data: deckData
    };

    return result;
};

export default deckRead;
