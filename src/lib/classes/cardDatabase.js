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
    }
    get(cardId) {
        return this.cards.get(cardId);
    }
    getName(cardId) {
        return this.cards.has(cardId) ? this.cards.get(cardId).name : "unnamed";
    }
    getAll() {
        return this.cards;
    }
    getAllUnique(sort = false) {
        if (sort) {
            return new Map(
                arrFrom(this.unique.entries()).sort((a, b) =>
                    a[1].name.localeCompare(b[1].name)
                )
            );
        } else {
            return this.unique;
        }
    }
};

export default CardDatabase;
