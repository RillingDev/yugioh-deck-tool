import { arrUniq, mapFromObject } from "lightdash";
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

        console.log("LOADED Cards", this);
    }

    static isTreatedAsSame(card1, card2) {
        return (
            card1.treatedAs === card2.name ||
            (card1.treatedAs !== null && card1.treatedAs === card2.treatedAs) ||
            card1.name === card2.treatedAs ||
            card1.name === card2.name
        );
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
