"use strict";


const uriDeckEncode = function(deckData) {
    const deckUri = btoa(JSON.stringify(deckData));

    return `?d=${deckUri}`;
};

export default uriDeckEncode;
