import {
    compress
} from "./compress";
import {
    objValues,
    arrClone,
    arrCount,
} from "lightdash";

const optimizeList = deckList => objValues(deckList)
    .map(deckListPart => arrClone(arrCount(deckListPart))
        .map(entry => entry[1] > 1 ? `x${entry[1]}${entry[0]}` : entry[0])
        .join("+"))
    .join("|");

const uriDeckEncode = deckList => "?d=" + compress(optimizeList(deckList));

export default uriDeckEncode;
