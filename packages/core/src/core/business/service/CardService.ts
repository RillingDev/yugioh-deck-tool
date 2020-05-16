import { injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { intersection, uniqBy } from "lodash";
import { countMapBy } from "lightdash";

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
    public countCards(cards: Card[]): Map<Card, number> {
        return countMapBy(cards, (card: Card) => card);
    }

    /**
     * Creates a list of cards with their count in a text representation: {@code ["Foo Bar x3", "Fizz x1"]}
     *
     * @param cards Cards to count
     * @return List of string representation of cards with their count.
     */
    public createCountedCardList(cards: Card[]): string[] {
        return Array.from(this.countCards(cards).entries()).map(
            ([card, count]) => `${card.name} x${count}`
        );
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
