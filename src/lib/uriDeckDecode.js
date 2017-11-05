import {
    decompress
} from "./compress";

const uriDeckDecode = function (deckParts, deckUri) {
    const deckArray = decompress(deckUri.replace("?d=", ""));
    const deckList = {};

    deckParts.forEach((deckPart, index) => {
        deckList[deckPart.id] = deckArray[index].map(String);
    });

    return deckList;
};

export default uriDeckDecode;
