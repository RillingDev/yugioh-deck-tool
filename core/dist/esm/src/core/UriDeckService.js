import { gzip } from "pako";
import { Base64 } from "js-base64";
const PADDING_SIZE = 10;
const PADDING_CHARACTER = "0";
const DELIMITER = "9".repeat(PADDING_SIZE);
class UriDeckService {
    compressDeckToQueryParamValue(deck) {
        let str = "";
        for (const deckPartKey of Object.keys(deck.cards)) {
            if (str.length > 0) {
                str += DELIMITER;
            }
            str += deck.cards[deckPartKey]
                .map(card => String(card.id).padStart(PADDING_SIZE, PADDING_CHARACTER))
                .join("");
        }
        const deflated = gzip(str, { to: "string" });
        return Base64.encodeURI(deflated);
    }
}
export { UriDeckService };
//# sourceMappingURL=UriDeckService.js.map