import { injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { intersection, uniqBy } from "lodash";
import { Format } from "../../model/ygo/Format";
import { BanState, DefaultBanState } from "../../model/ygo/BanState";
import { BanlistInfo } from "../../model/ygo/BanlistInfo";
import { countMapBy } from "lightdash";

/**
 * @public
 */
@injectable()
class CardService {
    /**
     * Gets the {@link BanState} of a card by format.
     *
     * @param card Card to check.
     * @param format Format to check against. May be null for no format.
     * @return BanState for the card in the format.
     */
    public getBanStateByFormat(card: Card, format: Format | null): BanState {
        // If no format is specified, it is unknown -> unlimited
        if (format == null) {
            return DefaultBanState.UNLIMITED;
        }

        // If the format is not listed, it is not allowed -> banned
        if (!card.formats.includes(format)) {
            return DefaultBanState.BANNED;
        }

        // If the format is listed,but no explicit ban state is set -> unlimited
        if (!(format in card.banlist)) {
            return DefaultBanState.UNLIMITED;
        }
        // If a ban state is set -> use ban state
        return card.banlist[format as keyof BanlistInfo];
    }

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
