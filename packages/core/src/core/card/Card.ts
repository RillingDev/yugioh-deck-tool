import { ReleaseInfo } from "./ReleaseInfo";
import { BanlistInfo } from "./banlist/BanlistInfo";
import { CardImage } from "./CardImage";
import { CardPrices } from "./CardPrices";
import { Format } from "./format/Format";
import { CardSet } from "./set/CardSet";
import { CardType } from "./type/CardType";

/**
 * Regular card. Also see {@link UnlinkedCard}.
 */
interface Card {
    readonly passcode: string; // Passcode/ID is a 8-digit unique code for each card
    readonly name: string;
    readonly description: string;

    readonly type: CardType; // See CardType
    readonly subType: string; // E.g. "Warrior" or "Equip Spell"

    readonly attribute: string | null;
    readonly atk: number | null;
    readonly def: number | null;
    readonly level: number | null;
    readonly pendulumScale: number | null;
    readonly linkRating: number | null;
    readonly linkMarkers: string[] | null;

    readonly betaName: string | null;
    readonly treatedAs: string | null;
    readonly archetype: string | null;

    readonly release: ReleaseInfo;
    readonly sets: CardSet[];
    readonly formats: Format[];
    readonly banlist: BanlistInfo;

    readonly image: CardImage | null;
    readonly prices: CardPrices;
    readonly views: number;
}

export { Card };
