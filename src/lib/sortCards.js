import { CARD_TYPE } from "./data/deck";

const sortCards = (list, cardDb) =>
    list.sort((a, b) => {
        const dataA = cardDb.get(a);
        const dataB = cardDb.get(b);
        const typeComp =
            CARD_TYPE.indexOf(dataA[1]) - CARD_TYPE.indexOf(dataB[1]);
        const lvComp = Number(dataB[4]) - Number(dataA[4]);
        const rcComp = dataA[5].localeCompare(dataB[5]);
        const nameComp = dataA[0].localeCompare(dataB[0]);

        if (typeComp !== 0) {
            return typeComp;
        } else if (lvComp !== 0) {
            return lvComp;
        } else if (rcComp !== 0) {
            return rcComp;
        }

        return nameComp;
    });

export default sortCards;
