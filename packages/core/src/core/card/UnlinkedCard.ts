import { CardSetAppearance } from "./set/CardSetAppearance";
import { CardImage } from "./CardImage";
import { CardPrices } from "./CardPrices";
import { Format } from "./format/Format";
import { ReleaseInfo } from "./ReleaseInfo";
import { BanlistInfo } from "./banlist/BanlistInfo";

/**
 * Version of Card without references to CardType
 *
 * @see CardLinkingService
 */
interface UnlinkedCard {
    readonly passcode: string;
    readonly name: string;
    readonly description: string;

    readonly type: string;
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
    readonly sets: CardSetAppearance[];
    readonly formats: Format[];
    readonly banlist: BanlistInfo;

    readonly image: CardImage | null;
    readonly prices: CardPrices;
    readonly views: number;
}

export { UnlinkedCard };
