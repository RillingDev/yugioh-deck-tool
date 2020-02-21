import deepFreeze from "../deepFreeze";
import logger from "loglevel";
import { URL_DB_API, URL_IMAGE_UNKNOWN } from "../data/urls.js";

const banlistToNumber = val => {
    if (val === "Banned") {
        return 0;
    }
    if (val === "Limited") {
        return 1;
    }
    if (val === "Semi-Limited") {
        return 2;
    }
    return 3;
};

const createIdMap = cardArr => {
    const result = new Map();
    for (const card of cardArr) {
        const imageUrl =
            card.images.length > 0 ? card.images[0].url : URL_IMAGE_UNKNOWN;

        result.set(String(card.id), {
            name: card.name,

            type: card.type,
            race: card.race,
            attribute: card.attribute ?? null,
            stats: [card.atk ?? null, card.def ?? null, card.level ?? null],
            linkmarkers: card.linkmarkers ?? [],

            format: card.formats,
            limit: [
                banlistToNumber(card.banlist.tcg),
                banlistToNumber(card.banlist.ocg)
            ],
            sets: createSetArr(card.sets),

            treatedAs: card.treatedAs,
            date: new Date(card.release.tcg).getTime(),
            times: card.views,
            rating: [0, 0],

            imageUrl: imageUrl,
            referenceUrl: URL_DB_API + encodeURI(card.name)
        });
    }
    return result;
};

const createSetArr = cardSets => cardSets.map(set => set.name);

const CardDatabase = class {
    constructor(cardInfo = [], cardSets = []) {
        this.cards = createIdMap(cardInfo);
        this.pairsArr = Array.from(this.cards.entries());
        this.sets = createSetArr(cardSets);
        /**
         * The arrays dont need to be modified again, freezing improves performance by preventing Vue from adding watchers
         */
        deepFreeze(this.cards);
        deepFreeze(this.pairsArr);
        deepFreeze(this.sets);
        deepFreeze(this);

        logger.log("LOADED Cards", this);
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
