"use strict";

import deckParts from "../data/deckParts";

const uriDeckDecode = function (deckUri) {
    const deckArray = JSON.parse(atob(deckUri.replace("?d=", "")));
    const deckList = {};

    deckParts.forEach((deckpart, index) => {
        deckList[deckpart.id] = deckArray[1][index];
    });

    return [deckArray[0], deckList];
};

export default uriDeckDecode;
