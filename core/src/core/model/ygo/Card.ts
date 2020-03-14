import { ReleaseInfo } from "./ReleaseInfo";
import { BanlistInfo } from "./BanlistInfo";
import { CardImage } from "./CardImage";
import { CardPrices } from "./CardPrices";
import { Format } from "./Format";
import { CardSet } from "./CardSet";
import { CardType } from "./CardType";

/**
 * Regular card. Also see {@link UnlinkedCard}.
 */
interface Card {
    readonly id: string;
    readonly name: string;

    readonly type: CardType;
    readonly race: string;
    readonly attribute: string | null;
    readonly atk: number | null;
    readonly def: number | null;
    readonly level: number | null;
    readonly scale: number | null;
    readonly linkVal: number | null;
    readonly linkMarkers: string[] | null;

    readonly sets: CardSet[];
    readonly image: CardImage | null;
    readonly prices: CardPrices | null;

    readonly betaName: string | null;
    readonly treatedAs: string | null;
    readonly archetype: string | null;
    readonly formats: Format[];
    readonly release: ReleaseInfo;
    readonly banlist: BanlistInfo;

    readonly views: number;
}

export { Card };
