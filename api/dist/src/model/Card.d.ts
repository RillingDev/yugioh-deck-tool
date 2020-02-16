interface Card {
    id: number;
    name: string;
    type: string;
    desc: string;
    race: string;
    archetype?: string;
    card_sets?: CardSetsEntity[];
    card_images?: CardImagesEntity[];
    card_prices?: CardPricesEntity[];
    misc_info?: MiscInfoEntity[];
    atk?: number;
    def?: number;
    level?: number;
    attribute?: string;
    banlist_info?: BanlistInfo;
    scale?: number;
    linkval?: number;
    linkmarkers?: string[];
}
interface CardSetsEntity {
    set_name: string;
    set_code: string;
    set_rarity: string;
    set_price: string;
}
interface CardImagesEntity {
    id: number;
    image_url: string;
    image_url_small: string;
}
interface CardPricesEntity {
    cardmarket_price: string;
    tcgplayer_price: string;
    ebay_price: string;
    amazon_price: string;
}
interface MiscInfoEntity {
    beta_name?: string;
    views: number;
    formats?: string[];
    tcg_date?: string;
    ocg_date?: string;
    treated_as?: string;
}
interface BanlistInfo {
    ban_tcg?: string;
    ban_ocg?: string;
    ban_goat?: string;
}
export { Card };
