import { UnlinkedCard } from "../../core/business/CardDataLoaderService";
interface RawCard {
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
    card_sets?: RawCardSetAppearance[];
    card_images?: RawCardImage[];
    card_prices?: RawCardPrices[];
    archetype?: string;
    misc_info?: RawMiscInfo[];
    banlist_info?: RawBanlistInfo;
}
interface RawCardSetAppearance {
    set_name: string;
    set_code: string;
    set_rarity: string;
    set_price: string;
}
interface RawCardImage {
    id: number;
    image_url: string;
    image_url_small: string;
}
interface RawCardPrices {
    cardmarket_price: string;
    tcgplayer_price: string;
    ebay_price: string;
    amazon_price: string;
    coolstuffinc_price: string;
}
interface RawMiscInfo {
    beta_name?: string;
    views: number;
    formats?: string[];
    tcg_date?: string;
    ocg_date?: string;
    treated_as?: string;
}
interface RawBanlistInfo {
    ban_tcg?: string;
    ban_ocg?: string;
    ban_goat?: string;
}
declare const mapCardInfo: (data: RawCard[]) => UnlinkedCard[];
export { mapCardInfo, RawCard };
