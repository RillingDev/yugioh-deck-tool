import { injectable } from "inversify";
import type { Card } from "./Card";
import { intersection, uniqBy } from "lodash";
import { countMapBy } from "lightdash";
import type { CardTypeCategory } from "./type/CardTypeCategory";
import type { CardType } from "./type/CardType";

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
        return countMapBy(cards, (card) => card);
    }

    /**
     * Counts cards by type. Types with no occurrence are omitted.
     *
     * @param cards Cards to count.
     * @return Map mapping the card type to its count.
     */
    public countByType(cards: ReadonlyArray<Card>): Counted<CardType> {
        return countMapBy(cards, (card) => card.type);
    }

    /**
     * Counts cards by type category. Type categories with no occurrence are omitted.
     *
     * @param cards Cards to count.
     * @return Map mapping the card type category to its count.
     */
    public countByTypeCategory(
        cards: ReadonlyArray<Card>
    ): Counted<CardTypeCategory> {
        return countMapBy(cards, (card) => card.type.category);
    }

    /**
     * Creates a list of cards with their count in a text representation: {@code ["3x Foo Bar", "1x Fizz"]}.
     *
     * @param cards Cards to count.
     * @return List of string representation of cards with their count.
     */
    public createFormattedCardCountList(cards: ReadonlyArray<Card>): string[] {
        return Array.from(this.countByCard(cards).entries())
            .filter(([, count]) => count > 0)
            .map(([card, count]) => `${count}x ${card.name}`);
    }
    /**
     * Gets a link to more details about a card.
     *
     * @param card Card to create a link for.
     * @return Link.
     */
    public getReferenceLink(card: Card): string {
        return `https://db.ygoprodeck.com/card/?search=${encodeURIComponent(
            card.name
        )}`;
    }
}

export { CardService };
