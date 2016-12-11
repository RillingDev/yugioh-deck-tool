"use strict";

const uriDeckDecode = function(deckUri) {
    return JSON.parse(atob(deckUri.replace("?d=", "")));
};

export default uriDeckDecode;
