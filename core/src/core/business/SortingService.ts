import { inject, injectable } from "inversify";
import { Card } from "../model/Card";
import { TYPES } from "../../types";
import { CardDatabase } from "./CardDatabase";
import { CardTypeGroup } from "../model/CardTypeGroup";
import { shuffle } from "lodash";

@injectable()
class SortingService {
    private readonly cardDatabase: CardDatabase;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase
    ) {
        this.cardDatabase = cardDatabase;
    }

    public shuffle(cards: Card[]): Card[] {
        return shuffle(cards);
    }

    public sort(cards: Card[]): Card[] {
        return cards.sort((a: Card, b: Card) => {
            // First, sort after the sort group.
            if (a.type.sortGroup != b.type.sortGroup) {
                return a.type.sortGroup - b.type.sortGroup;
            }

            // For non-monsters, sort by sub-type (race).
            if (a.type.group !== CardTypeGroup.MONSTER && a.race != b.race) {
                const races = this.cardDatabase.getRaces(a.type.group);
                return races.indexOf(b.race) - races.indexOf(a.race);
            }
            // For monsters, sort by level.
            if (a.type.group === CardTypeGroup.MONSTER && a.level !== b.level) {
                return b.level! - a.level!; // Sort descending rather than ascending.
            }

            // As the last step, sort by name.
            return a.name.localeCompare(b.name);
        });
    }
}

export { SortingService };
