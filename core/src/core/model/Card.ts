import { ReleaseInfo } from "./ReleaseInfo";
import { BanlistInfo } from "./BanlistInfo";
import { CardSetAppearance } from "./CardSetAppearance";
import { CardImage } from "./CardImage";
import { CardPrices } from "./CardPrices";

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

export { Card };
