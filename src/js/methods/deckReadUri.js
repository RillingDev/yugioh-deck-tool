"use strict";

import uriDeckDecode from "./uriDeckDecode";
import deckUnique from "./deckUnique";

const deckReadUri = function(uriDeck) {
    const deckData = uriDeckDecode(uriDeck);
    const deckUniqueCards = deckUnique(deckData);

    const result = {
        file: "",
        data: deckData,
        unique: deckUniqueCards,
        link: uriDeck
    };

    console.log(result);

    return result;
};

export default deckReadUri;
