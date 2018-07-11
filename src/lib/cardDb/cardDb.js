import { mapFromObject, arrUniq } from "lightdash";
import deepFreeze from "../deepFreeze";

const getSets = pairsArr => {
    const result = [];

    pairsArr.forEach(pair => {
        result.push(...pair[1].sets);
    });

    return arrUniq(result).sort();
};

const CardDatabase = class {
    constructor(obj = {}) {
        this.cards = mapFromObject(obj);
        this.pairsArr = Array.from(this.cards.entries());
        this.sets = getSets(this.pairsArr);

        /**
         * The arrays dont need to be modified again, freezing improves performance by preventing Vue from adding watchers
         */
        deepFreeze(this.cards);
        deepFreeze(this.pairsArr);
        deepFreeze(this.sets);
        deepFreeze(this);

        // eslint-disable-next-line no-console
        console.log("LOADED Cards", this);
    }
    has(cardId) {
        return this.cards.has(cardId);
    }
    get(cardId) {
        return this.cards.get(cardId);
    }
    getName(cardId) {
        return this.has(cardId) ? this.get(cardId).name : `[${cardId}]`;
    }
};

export default CardDatabase;
