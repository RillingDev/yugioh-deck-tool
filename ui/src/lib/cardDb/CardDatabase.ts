import deepFreeze from "../deepFreeze";
import logger from "loglevel";
import { Card, CardSet } from "../../../../core";

const createIdMap = cardArr => {
    const result = new Map();
    for (const card of cardArr) {
        result.set(String(card.id), card);
    }
    return result;
};

class CardDatabase {
    private readonly cards: Map<string, Card>;
    private readonly pairsArr: [string, Card][];
    private readonly sets: CardSet[];

    constructor(cardInfo: Card[] = [], cardSets: CardSet[] = []) {
        this.cards = createIdMap(cardInfo);
        this.pairsArr = Array.from(this.cards.entries());
        this.sets = cardSets;
        /**
         * The arrays dont need to be modified again, freezing improves performance by preventing Vue from adding watchers
         */
        deepFreeze(this.cards);
        deepFreeze(this.pairsArr);
        deepFreeze(this.sets);
        deepFreeze(this);

        logger.info("LOADED Cards", this);
    }

    static isTreatedAsSame(card1: Card, card2: Card): boolean {
        return (
            card1.treatedAs === card2.name ||
            (card1.treatedAs !== null && card1.treatedAs === card2.treatedAs) ||
            card1.name === card2.treatedAs ||
            card1.name === card2.name
        );
    }

    has(cardId: string): boolean {
        return this.cards.has(cardId);
    }

    get(cardId: string): Card {
        return this.cards.get(cardId);
    }

    getName(cardId: string): string {
        return this.has(cardId) ? this.get(cardId).name : `[${cardId}]`;
    }
}

export default CardDatabase;
