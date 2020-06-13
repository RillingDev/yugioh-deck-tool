import { injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { intersection, uniqBy } from "lodash";
import { countMapBy } from "lightdash";
import { CardTypeGroup } from "../../model/ygo/CardTypeGroup";
import { CardType } from "../../model/ygo/CardType";

export type Counted<T> = Map<T, number>;

/**
 * @public
 */
@injectable()
class CardService {
    /**
     * Gets all cards with unique names, keeping the first card per name.
     * This can be useful for filtering out alternate artworks.
     * Note that unlike {@link #isTreatedAsSame} "treated as" and beta name are NOT considered here.
     *
     * @param cards Cards to filter.
     * @return Cards with unique names.
     */
    public getUniqueByName(cards: Card[]): Card[] {
        return uniqBy(cards, (card) => card.name);
    }

    /**
     * Gets all names of a card, including the official name, the beta name, and the "treated as" name.
     *
     * @param card Card to check.
     * @return Names of this card.
     */
    public getAllNames(card: Card): string[] {
        const names = [card.name];
        if (card.treatedAs != null) {
            names.push(card.treatedAs);
        }
        if (card.betaName != null) {
            names.push(card.betaName);
        }
        return names;
    }

    /**
     * Checks if two cards are treated as the same, meaning their names overlap.
     *
     * @param cardA First card.
     * @param cardB Second card.
     * @return If the cards are treated as the same.
     */
    public isTreatedAsSame(cardA: Card, cardB: Card): boolean {
        return (
            intersection(this.getAllNames(cardA), this.getAllNames(cardB))
                .length > 0
        );
    }

    /**
     * Counts cards.
     *
     * @param cards Cards to count.
     * @return Map mapping the card to its count.
     */
    public countByCard(cards: ReadonlyArray<Card>): Counted<Card> {
        return countMapBy(cards, (card: Card) => card);
    }

    /**
     * Counts cards by type. Types with no occurrence are omitted.
     *
     * @param cards Cards to count.
     * @return Map mapping the card type to its count.
     */
    public countByType(cards: ReadonlyArray<Card>): Counted<CardType> {
        return countMapBy(cards, (card: Card) => card.type);
    }

    /**
     * Counts cards by type group. Type groups with no occurrence are omitted.
     *
     * @param cards Cards to count.
     * @return Map mapping the card type group to its count.
     */
    public countByTypeGroup(
        cards: ReadonlyArray<Card>
    ): Counted<CardTypeGroup> {
        return countMapBy(cards, (card: Card) => card.type.group);
    }

    /**
     * Creates a list of cards with their count in a text representation: {@code ["Foo Bar x3", "Fizz x1"]}
     *
     * @param counted Counted card map.
     * @return List of string representation of cards with their count.
     */
    public createFormattedCardCountList(counted: Counted<Card>): string[] {
        return this.createCountedList(
            counted,
            (card, count) => `${card.name} x${count}`
        );
    }

    private createCountedList<T>(
        counted: Counted<T>,
        formatter: (key: T, count: number) => string
    ): string[] {
        return Array.from(counted.entries())
            .filter(([, count]) => count > 0)
            .map(([key, count]) => formatter(key, count));
    }

    /**
     * Gets a link to more details about a card.
     *
     * @param card Card to create link for.
     * @return Link.
     */
    public getReferenceLink(card: Card): string {
        return `https://db.ygoprodeck.com/card/?search=${encodeURIComponent(
            card.name
        )}`;
    }
}

export { CardService };
