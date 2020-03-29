import { injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { intersection } from "lodash";
import { Format } from "../../model/ygo/Format";
import { BanState, DefaultBanState } from "../../model/ygo/BanState";
import { BanlistInfo } from "../../model/ygo/BanlistInfo";
import { groupMapReducingBy } from "lightdash";

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
        return card.banlist[<keyof BanlistInfo>format];
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
        const names = new Set<string>();
        return cards.filter((card) => {
            if (names.has(card.name)) {
                return false;
            }
            names.add(card.name);
            return true;
        });
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
        return groupMapReducingBy(
            cards,
            (card) => card,
            () => 0,
            (current) => current + 1
        );
    }
}

export { CardService };
