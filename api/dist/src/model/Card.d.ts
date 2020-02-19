interface Card {
    id: number;
    name: string;
    desc: string;
    type: string;
    race: string;
    attribute?: string;
    atk?: number;
    def?: number;
    level?: number;
    scale?: number;
    linkval?: number;
    linkmarkers?: string[];
    sets: CardSet[];
    images: CardImage[];
    prices: CardPrices[];
    betaName: string | null;
    treatedAs: string | null;
    archetype: string | null;
    formats: string[];
    release: ReleaseInfo | null;
    banlist: BanlistInfo | null;
    views: number;
}
interface CardSet {
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
interface ReleaseInfo {
    tcg: string | null;
    ocg: string | null;
}
interface BanlistInfo {
    tcg: string | null;
    ocg: string | null;
    goat: string | null;
}
export { Card };
