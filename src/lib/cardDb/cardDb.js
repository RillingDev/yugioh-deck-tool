import { mapFromObject } from "lightdash";
import deepFreeze from "../deepFreeze";

const excludeAlternateArtworks = arr => {
    const names = new Set();

    return arr.filter(entry => {
        const name = entry[1].name;

        if (!names.has(name)) {
            names.add(name);

            return true;
        }

        return false;
    });
};

const CardDatabase = class {
    constructor(obj = {}) {
        this.cards = mapFromObject(obj);
        this.pairsArr = Array.from(this.cards.entries());
        this.pairsArrUniq = excludeAlternateArtworks(this.pairsArr);

        /**
         * The arrays dont need to be modified again, freezing improves performance by preventing Vue from adding watchers
         */
        deepFreeze(this.cards);
        deepFreeze(this.pairsArr);
        deepFreeze(this.pairsArrUniq);
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
