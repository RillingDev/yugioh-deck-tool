import { CardSetAppearance } from "./CardSetAppearance";
import { CardImage } from "../CardImage";
import { CardPrices } from "../CardPrices";
import { Format } from "../Format";
import { ReleaseInfo } from "../ReleaseInfo";
import { BanlistInfo } from "../BanlistInfo";

/**
 * Version of Card without references to CardType
 *
 * @see CardLinkingService
 */
interface UnlinkedCard {
    readonly id: string;
    readonly name: string;
    readonly desc: string;

    readonly type: string;
    readonly race: string;
    readonly attribute: string | null;
    readonly atk: number | null;
    readonly def: number | null;
    readonly level: number | null;
    readonly scale: number | null;
    readonly linkVal: number | null;
    readonly linkMarkers: string[] | null;

    readonly sets: CardSetAppearance[];
    readonly image: CardImage | null;
    readonly prices: CardPrices;

    readonly betaName: string | null;
    readonly treatedAs: string | null;
    readonly archetype: string | null;
    readonly formats: Format[];
    readonly release: ReleaseInfo;
    readonly banlist: BanlistInfo;

    readonly views: number;
    readonly votes: {
        readonly up: number;
        readonly down: number;
    };
}

export { UnlinkedCard };
