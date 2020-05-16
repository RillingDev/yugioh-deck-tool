import { injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { Format } from "../../model/ygo/Format";
import { BanState, DefaultBanState } from "../../model/ygo/BanState";
import { BanlistInfo } from "../../model/ygo/BanlistInfo";

/**
 * @public
 */
@injectable()
class BanlistService {
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
}

export { BanlistService };
