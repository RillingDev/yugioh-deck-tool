import { injectable } from "inversify";
import { Card } from "../model/ygo/Card";
import { intersection } from "lodash";
import { Format } from "../model/ygo/Format";
import { BanState } from "../model/ygo/BanState";
import { BanlistInfo } from "../model/ygo/BanlistInfo";
import { DefaultBanState } from "../model/ygo/DefaultBanState";

@injectable()
class CardService {
    public isTreatedAsSame(cardA: Card, cardB: Card): boolean {
        return (
            intersection(this.getAllNames(cardA), this.getAllNames(cardB))
                .length > 0
        );
    }

    public getBanStateByFormat(card: Card, format: Format): BanState {
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

    private getAllNames(card: Card): string[] {
        const names = [card.name];
        if (card.treatedAs != null) {
            names.push(card.treatedAs);
        }
        return names;
    }
}

export { CardService };
