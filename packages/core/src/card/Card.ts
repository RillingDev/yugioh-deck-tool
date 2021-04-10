import type { ReleaseInfo } from "./ReleaseInfo";
import type { BanlistInfo } from "./banlist/BanlistInfo";
import type { CardImage } from "./CardImage";
import type { CardPrices } from "./CardPrices";
import type { Format } from "./format/Format";
import type { CardSet } from "./set/CardSet";
import type { CardType } from "./type/CardType";

/**
 * Regular card. Also see {@link UnlinkedCard}.
 */
export interface Card {
    /**
     * Passcode/ID is an 8-digit unique code for each card
     */
    readonly passcode: string;
    readonly name: string;
    readonly description: string;

    /**
     * @see CardType
     */
    readonly type: CardType;

    /**
     * E.g. "Warrior" or "Equip Spell"
     */
    readonly subType: string;

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
