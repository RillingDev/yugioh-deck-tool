import { objEntries, arrFrom } from "lightdash";

const CardDatabase = class {
    constructor(obj = {}) {
        const entries = objEntries(obj);

        this.cards = new Map();

        entries.forEach(entry => {
            const id = entry[0];
            const val = entry[1];

            if (val[0].length > 0) {
                this.cards.set(id, val);
            }
        });

        /**
         * The arrays dont need to be modified again, freezing improves performance
         */
        Object.freeze(this);
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
    getAll() {
        return this.cards;
    }
};

export default CardDatabase;
