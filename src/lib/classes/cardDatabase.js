import { objEntries, arrFrom } from "lightdash";

const CardDatabase = class {
    constructor(obj = {}) {
        const entries = objEntries(
            obj
        ) /* .sort(
            (a, b) => Number(b[0]) - Number(a[0])
        ) */;
        const nameCache = new Set();

        this.cards = new Map();
        this.unique = new Map();

        entries.forEach(entry => {
            const id = entry[0];
            const val = entry[1];

            if (val[0].length > 0) {
                this.cards.set(id, val);

                // Only add each card once to parts, skip alternate arts
                if (!nameCache.has(val[0])) {
                    this.unique.set(id, val);
                }

                nameCache.add(val[0]);
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
    getAllUnique() {
        return this.unique;
    }
};

export default CardDatabase;
