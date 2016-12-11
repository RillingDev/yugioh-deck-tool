"use strict";

import deckParse from "./deckParse";
import deckUnique from "./deckUnique";
import uriDeckEncode from "./uriDeckEncode";

const deckRead = function(fileContent) {
    const deckData = deckParse(fileContent);
    const deckUniqueCards = deckUnique(deckData);
    const deckShareLink = uriDeckEncode(deckData);
    const result = {
        file: fileContent,
        data: deckData,
        unique: deckUniqueCards,
        link: deckShareLink
    };

    console.log(result);

    return result;
};

export default deckRead;
