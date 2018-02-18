import { forEachEntry, arrFrom } from "lightdash";

const CardDatabase = class {
    constructor(obj = {}) {
        this.cards = new Map();

        forEachEntry(obj, (id, val) => {
            if (val[0].length > 0) {
                this.cards.set(id, val);
            }
        });

        this.pairsArr = arrFrom(this.cards.entries());

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
