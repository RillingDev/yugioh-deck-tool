import {
    decodeBase64
} from "./base64";

const uriDeckDecode = function (deckParts, deckUri) {
    const deckArray = decodeBase64(deckUri.replace("?d=", ""));
    const deckList = {};

    deckParts.forEach((deckpart, index) => {
        deckList[deckpart.id] = deckArray[1][index].map(String);
    });

    return [deckArray[0], deckList];
};

export default uriDeckDecode;
