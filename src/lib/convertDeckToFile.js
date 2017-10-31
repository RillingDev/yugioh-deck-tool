const convertDeckToFile = function (deckParts, deckList) {
    let result = [];

    deckParts.forEach(deckpart => {
        result.push(deckpart.fileId);
        result = result.concat(deckList[deckpart.id]);
    });

    return result.join("\n");
};

export default convertDeckToFile;
