import { CardSet } from "../model/ygo/CardSet";
import { CardValues } from "../model/ygo/CardValues";
import { CardSetAppearance } from "../model/ygo/CardSetAppearance";
import { CardImage } from "../model/ygo/CardImage";
import { CardPrices } from "../model/ygo/CardPrices";
import { Format } from "../model/ygo/Format";
import { ReleaseInfo } from "../model/ygo/ReleaseInfo";
import { BanlistInfo } from "../model/ygo/BanlistInfo";

// Version of Card without references to CardType
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
    readonly prices: CardPrices | null;

    readonly betaName: string | null;
    readonly treatedAs: string | null;
    readonly archetype: string | null;
    readonly formats: Format[];
    readonly release: ReleaseInfo;
    readonly banlist: BanlistInfo;

    readonly views: number;
}

interface CardDataLoaderService {
    getCardInfo(): Promise<UnlinkedCard[]>;

    getCardSets(): Promise<CardSet[]>;

    getCardValues(): Promise<CardValues>;
}

export { CardDataLoaderService, UnlinkedCard };
