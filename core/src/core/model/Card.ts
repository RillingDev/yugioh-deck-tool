import { ReleaseInfo } from "./ReleaseInfo";
import { BanlistInfo } from "./BanlistInfo";

interface Card {
    id: number;
    name: string;
    desc: string;

    type: string;
    race: string;
    attribute: string | null;
    atk: number | null;
    def: number | null;
    level: number | null;
    scale: number | null;
    linkval: number | null;
    linkmarkers: string[] | null;

    sets: CardSetAppearance[];
    image: CardImage | null;
    prices: CardPrices | null;

    betaName: string | null;
    treatedAs: string | null;
    archetype: string | null;
    formats: string[];
    release: ReleaseInfo;
    banlist: BanlistInfo;

    views: number;
}

interface CardSetAppearance {
    name: string;
    code: string;
    rarity: string;
    price: string;
}

interface CardImage {
    id: number;
    url: string;
    urlSmall: string;
}

interface CardPrices {
    cardmarket: string;
    tcgplayer: string;
    ebay: string;
    amazon: string;
}
export { Card };
