const uriDeckEncode = function (deck) {
    const deckArray = [deck.name, Object.values(deck.list)];
    const deckUri = btoa(JSON.stringify(deckArray));

    return "?d=" + deckUri;
};

export default uriDeckEncode;
