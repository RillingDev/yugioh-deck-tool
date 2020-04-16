import { inject, injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { CardTypeGroup } from "../../model/ygo/CardTypeGroup";
import { CardDatabase } from "../CardDatabase";
import { TYPES } from "../../../types";
import { Format } from "../../model/ygo/Format";

enum SortingStrategy {
    /**
     * Sort cards like they would appear in a sorted deck
     */
    DECK = "Deck",

    NAME = "Name",

    ATK = "ATK",
    DEF = "DEF",
    LEVEL = "Level",

    VIEWS = "Views",
    RELEASE_DATE = "Release Date",
}

enum SortingOrder {
    ASC = "Asc",
    DESC = "Desc",
}

type Comparator<T> = (a: T, b: T) => number;

/**
 * @public
 */
@injectable()
class SortingService {
    private readonly cardDatabase: CardDatabase;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase
    ) {
        this.cardDatabase = cardDatabase;
    }

    /**
     * Sorts a list of cards.
     *
     * @param cards Cards to filter.
     * @param strategy Strategy to sort by.
     * @param order If the result should be sorted ascending or descending.
     * @return Sorted cards.
     */
    public sort(
        cards: Card[],
        strategy: SortingStrategy,
        order: SortingOrder = SortingOrder.DESC
    ): Card[] {
        const modifier = order === SortingOrder.ASC ? -1 : 1;
        const comparator = this.findComparator(strategy);
        return cards.sort((a, b) => comparator(a, b) * modifier);
    }

    private findComparator(strategy: SortingStrategy): Comparator<Card> {
        if (strategy === SortingStrategy.DECK) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            return (a, b) => this.compareDeck(a, b);
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        }
        if (strategy === SortingStrategy.NAME) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            return (a, b) => this.compareName(a, b);
        }
        if (strategy === SortingStrategy.ATK) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            return (a, b) => this.compareAtk(a, b);
        }
        if (strategy === SortingStrategy.DEF) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            return (a, b) => this.compareDef(a, b);
        }
        if (strategy === SortingStrategy.LEVEL) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            return (a, b) => this.compareLevel(a, b);
        }
        if (strategy === SortingStrategy.RELEASE_DATE) {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            return (a, b) => this.compareReleaseDate(a, b);
        }
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return (a, b) => this.compareViews(a, b);
    }

    private compareName(a: Card, b: Card): number {
        return a.name.localeCompare(b.name);
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

    private compareReleaseDate(a: Card, b: Card): number {
        return (a.release[Format.TCG] ?? 0) - (b.release[Format.TCG] ?? 0);
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

export { SortingService, SortingStrategy, SortingOrder };
