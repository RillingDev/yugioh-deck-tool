import { CardSet } from "../model/CardSet";
import { CardValues } from "../model/CardValues";
import { CardSetAppearance } from "../model/CardSetAppearance";
import { CardImage } from "../model/CardImage";
import { CardPrices } from "../model/CardPrices";
import { Format } from "../model/Format";
import { ReleaseInfo } from "../model/ReleaseInfo";
import { BanlistInfo } from "../model/BanlistInfo";

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
    readonly linkval: number | null;
    readonly linkmarkers: string[] | null;

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
