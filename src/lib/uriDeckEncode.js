import {
    compress
} from "./compress";
import {
    objValues,
} from "lightdash";

const uriDeckEncode = deckList => "?d=" + compress(objValues(deckList).map(deckListPart => deckListPart.map(Number)));

export default uriDeckEncode;
