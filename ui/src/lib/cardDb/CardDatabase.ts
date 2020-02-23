import deepFreeze from "../deepFreeze";
import logger from "loglevel";
import { URL_DB_API, URL_IMAGE_UNKNOWN } from "../data/urls";

const createIdMap = cardArr => {
    const result = new Map();
    for (const card of cardArr) {
        result.set(String(card.id), {
            name: card.name,

            type: card.type,
            race: card.race,
            attribute: card.attribute,
            atk: card.atk,
            def: card.def,
            level: card.level,
            linkmarkers: card.linkmarkers,

            format: card.formats,
            banlist: card.banlist,
            sets: createSetArr(card.sets),

            treatedAs: card.treatedAs,
            date: new Date(card.release.tcg).getTime(),
            times: card.views,
            image: card.image
        });
    }
    return result;
};

const createSetArr = cardSets => cardSets.map(set => set.name);

const CardDatabase = class {
    private cards: Map<any, any>;
    private pairsArr: [any, any][];
    private sets: any;

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

        logger.info("LOADED Cards", this);
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
