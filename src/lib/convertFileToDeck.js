const convertFileToDeck = function (deckparts, fileContent) {
    const result = {};
    const fileParts = fileContent
        .replace(/#created.+/, "")
        .trim()
        .split(/[#!].+\n?/g)
        .slice(1);

    deckparts.forEach((deckpart, index) => {
        result[deckpart.id] = fileParts[index]
            .split(/\n\r?/g)
            .map(line => line.trim())
            .filter(line => line.length > 0);
    });

    console.log({
        result
    });

    return result;
};

export default convertFileToDeck;
