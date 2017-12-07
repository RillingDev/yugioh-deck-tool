import { forEachEntry, arrFrom } from "lightdash";

const CardDatabase = class {
    constructor(obj = {}) {
        const nameCache = new Set();

        this.cards = new Map();
        this.unique = new Map();

        forEachEntry(obj, (val, id) => {
            if (val.name.length > 0) {
                this.cards.set(id, val);

                // Only add each card once to parts, skip alternate arts
                if (!nameCache.has(val.name)) {
                    this.unique.set(id, val);
                }

                nameCache.add(val.name);
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
        return this.has(cardId) ? this.get(cardId).name : `[${cardId}]`;
    }
    getAll() {
        return this.cards;
    }
    getAllUnique() {
        return this.unique;
    }
};

export default CardDatabase;
