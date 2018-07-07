import { URL_BUY_API } from "../data/urls";
import { DECKPARTS } from "../data/deck";
import { arrCount } from "lightdash";

const getShareText = (list, cardDb) => {
    const result = [];

    DECKPARTS.forEach((deckPart, index) => {
        const deckPartCards = list[index];

        if (deckPartCards.length > 0) {
            const deckPartCardsCounted = Array.from(
                arrCount(deckPartCards).entries()
            ).map(entry => `${cardDb.getName(entry[0])} x${entry[1]}`);

            result.push(`${deckPart.name}:`, ...deckPartCardsCounted, "");
        }
    });

    return result.join("\n").trim();
};

const getBuyLink = (listAll, cardDb) => {
    if (listAll.length > 0) {
        const cardsCounted = Array.from(arrCount(listAll).entries()).map(
            entry => `${entry[1]} ${cardDb.getName(entry[0])}`
        );

        return URL_BUY_API + ["", ...cardsCounted, ""].join("||").trim();
    }

    return null;
};

export { getShareText, getBuyLink };
