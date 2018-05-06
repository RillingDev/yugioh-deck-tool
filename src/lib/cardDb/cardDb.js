import { mapFromObject } from "lightdash";

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
        Object.freeze(this.cards);
        Object.freeze(this.pairsArr);
        Object.freeze(this.pairsArrUniq);
        Object.freeze(this);

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
