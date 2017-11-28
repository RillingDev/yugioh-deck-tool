const convertFileToDeck = function (deckParts, fileContent) {
  const result = {};
  const fileParts = fileContent
    .replace(/#created.+/, "")
    .trim()
    .split(/[#!].+\n?/g)
    .slice(1);

  deckParts.forEach((deckPart, index) => {
    result[deckPart.id] = fileParts[index]
      .split(/\n\r?/g)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  });

  return result;
};

export default convertFileToDeck;
