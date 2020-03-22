import { injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { intersection } from "lodash";
import { Format } from "../../model/ygo/Format";
import { BanState, DefaultBanState } from "../../model/ygo/BanState";
import { BanlistInfo } from "../../model/ygo/BanlistInfo";
import { groupMapReducingBy } from "lightdash";

@injectable()
class CardService {
    public isTreatedAsSame(cardA: Card, cardB: Card): boolean {
        return (
            intersection(this.getAllNames(cardA), this.getAllNames(cardB))
                .length > 0
        );
    }

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
