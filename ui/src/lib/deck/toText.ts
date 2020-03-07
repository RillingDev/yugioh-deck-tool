import { URL_BUY_API } from "../data/urls";
import { countBy } from "lodash";
import { toMap } from "lightdash";
import { DEFAULT_DECKPART_ARR } from "../../../../core";

const getName = (cardDb, cardId) =>
    cardDb.hasCard(cardId) ? cardDb.getCard(cardId).name : `[${cardId}]`;

const getShareText = (list, cardDb) => {
    const result = [];

    DEFAULT_DECKPART_ARR.forEach((deckPart, index) => {
        const deckPartCards = list[index];

        if (deckPartCards.length > 0) {
            const deckPartCardsCounted = Array.from(
                toMap(countBy(deckPartCards)).entries()
            ).map(entry => `${getName(cardDb, entry[0])} x${entry[1]}`);

            result.push(`${deckPart.name}:`, ...deckPartCardsCounted, "");
        }
    });

    return result.join("\n").trim();
};

const getBuyLink = (listAll, cardDb) => {
    if (listAll.length > 0) {
        const cardsCounted = Array.from(toMap(countBy(listAll)).entries()).map(
            entry =>
                `${entry[1]} ${getName(cardDb, entry[0]).replace("&", "%26")}`
        );

        return URL_BUY_API + ["", ...cardsCounted, ""].join("||").trim();
    }

    return null;
};

export { getShareText, getBuyLink };
