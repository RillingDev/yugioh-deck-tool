import {
    encodeBase64
} from "./base64";
import {
    objValues,
} from "lightdash";

const uriDeckEncode = deck => "?d=" + encodeBase64([deck.name, objValues(deck.list)]);

export default uriDeckEncode;
