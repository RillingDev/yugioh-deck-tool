const convertDeckToFile = function(deckParts, deckList) {
    let result = [];

    deckParts.forEach(deckPart => {
        result.push(deckPart.indicator);
        result = result.concat(deckList[deckPart.id]);
    });

    return result.join("\n");
};

export default convertDeckToFile;
