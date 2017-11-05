import {
    decompress
} from "./compress";

const uriDeckDecode = function (deckParts, deckUri) {
    const deckArray = decompress(deckUri.replace("?d=", ""));
    const deckList = {};

    deckParts.forEach((deckpart, index) => {
        deckList[deckpart.id] = deckArray[index].map(String);
    });

    console.log({
        deckUri,
        deckArray,
        deckList
    });

    return deckList;
};

export default uriDeckDecode;
