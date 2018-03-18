import { mapFromObject } from "lightdash";

const excludeAlternateArtworks = arr => {
    const names = new Set();

    return arr.filter(entry => {
        const name = entry[1][0];

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
        this.pairsArr = excludeAlternateArtworks(
            Array.from(this.cards.entries())
        );

        /**
         * The arrays dont need to be modified again, freezing improves performance by preventing Vue from adding watchers
         */
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
        return this.has(cardId) ? this.get(cardId)[0] : `[${cardId}]`;
    }
};

export default CardDatabase;
