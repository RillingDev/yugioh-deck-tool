import { inject, injectable } from "inversify";
import { Card } from "../model/ygo/Card";
import { CardTypeGroup } from "../model/ygo/CardTypeGroup";
import { shuffle } from "lodash";
import { CardDatabase } from "./CardDatabase";
import { TYPES } from "../../types";

enum SortingStrategy {
    /**
     * Shuffle cards
     */
    SHUFFLE = "Shuffle",

    /**
     * Sort cards like they would appear in a sorted deck
     */
    DECK = "Deck",

    NAME = "Name (A-Z)",
    NAME_REVERSE = "Name (Z-A)",
    ATK = "ATK",
    DEF = "DEF",
    LEVEL = "Level",
    VIEWS = "Views"
}

type Comparator<T> = (a: T, b: T) => number;

@injectable()
class SortingService {
    private readonly cardDatabase: CardDatabase;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase
    ) {
        this.cardDatabase = cardDatabase;
    }

    public sort(cards: Card[], strategy: SortingStrategy): Card[] {
        if (strategy === SortingStrategy.SHUFFLE) {
            return shuffle(cards);
        }
        return cards.sort(this.findSortFn(strategy));
    }

    private findSortFn(
        strategy:
            | SortingStrategy.DECK
            | SortingStrategy.NAME
            | SortingStrategy.NAME_REVERSE
            | SortingStrategy.ATK
            | SortingStrategy.DEF
            | SortingStrategy.LEVEL
            | SortingStrategy.VIEWS
    ): Comparator<Card> {
        let sortFn: Comparator<Card>;
        if (strategy === SortingStrategy.DECK) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            sortFn = (a, b) => this.compareDeck(a, b);
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        } else if (strategy === SortingStrategy.NAME) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            sortFn = (a, b) => this.compareName(a, b);
        } else if (strategy === SortingStrategy.NAME_REVERSE) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            sortFn = (a, b) => this.compareNameReverse(a, b);
        } else if (strategy === SortingStrategy.ATK) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            sortFn = (a, b) => this.compareAtk(a, b);
        } else if (strategy === SortingStrategy.DEF) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            sortFn = (a, b) => this.compareDef(a, b);
        } else if (strategy === SortingStrategy.LEVEL) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            sortFn = (a, b) => this.compareLevel(a, b);
        } else {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            sortFn = (a, b) => this.compareViews(a, b);
        }
        return sortFn;
    }

    private compareName(a: Card, b: Card): number {
        return a.name.localeCompare(b.name);
    }

    private compareNameReverse(a: Card, b: Card): number {
        return this.compareName(a, b) * -1;
    }

    private compareAtk(a: Card, b: Card): number {
        return (b.atk ?? 0) - (a.atk ?? 0);
    }

    private compareDef(a: Card, b: Card): number {
        return (b.def ?? 0) - (a.def ?? 0);
    }

    private compareLevel(a: Card, b: Card): number {
        return (b.level ?? 0) - (a.level ?? 0);
    }

    private compareViews(a: Card, b: Card): number {
        return b.views - a.views;
    }

    private compareRace(a: Card, b: Card): number {
        const races = this.cardDatabase.getRaces(a.type.group);
        return races.indexOf(a.race) - races.indexOf(b.race);
    }

    /**
     * Deck-sorting function loosely based on
     * {@see https://github.com/Fluorohydride/ygopro}'s ./gframe/client_card.cpp sorting methods
     *
     * @param a Card A
     * @param b Card B
     * @return comparator result.
     */
    private compareDeck(a: Card, b: Card): number {
        // First, sort after the sort group.
        if (a.type.sortGroup != b.type.sortGroup) {
            return a.type.sortGroup - b.type.sortGroup;
        }

        // For monsters, sort by monster related attributes.
        if (a.type.group === CardTypeGroup.MONSTER) {
            if (a.level !== b.level) {
                return this.compareLevel(a, b);
            }
            if (a.atk !== b.atk) {
                return this.compareAtk(a, b);
            }
            if (a.def !== b.def) {
                return this.compareDef(a, b);
            }
        } else {
            // For non-monsters, sort just by race.
            if (a.race != b.race) {
                return this.compareRace(a, b);
            }
        }

        // As the last step, sort by name.
        return this.compareName(a, b);
    }
}

export { SortingService, SortingStrategy };
