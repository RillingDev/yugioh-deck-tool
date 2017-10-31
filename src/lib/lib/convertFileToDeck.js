const convertFileToDeck = function (deckParts, fileContent) {
    const fileContentTrimmed = fileContent.replace(/#created.+/, "").trim();
    const arr = fileContentTrimmed.split(/[#!].+/g).splice(1);
    const arrParts = arr.map(part => part.split("\n").filter(line => line.length > 1).map(Number));
    const result = {};

    deckParts.forEach((deckpart, index) => {
        result[deckpart.id] = arrParts[index];
    });

    return result;
};

export default convertFileToDeck;
