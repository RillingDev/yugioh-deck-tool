import { Card } from "../../core/model/Card";
import { BanState } from "../../core/model/BanState";

// https://jvilk.com/MakeTypes/
interface RawCard {
    id: number;
    name: string;
    type: string;
    desc: string;
    attribute?: string;
    race: string;
    archetype?: string;
    atk?: number;
    def?: number;
    level?: number;
    scale?: number;
    linkval?: number;
    linkmarkers?: string[];
    card_sets?: RawCardSet[];
    card_images?: RawCardImage[];
    card_prices?: RawCardPrices[];
    misc_info?: RawMiscInfo[];
    banlist_info?: RawBanlistInfo;
}

interface RawCardSet {
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

const mapBanListState = (name: string | null): BanState => {
    if (name === "Banned") {
        return BanState.BANNED;
    }
    if (name === "Limited") {
        return BanState.LIMITED;
    }
    if (name === "Semi-Limited") {
        return BanState.SEMI_LIMITED;
    }
    return BanState.UNLIMITED;
};

const mapCardInfo = (data: RawCard[]): Card[] =>
    data.map(rawCard => {
        const miscInfo: RawMiscInfo | null =
            rawCard.misc_info != null ? rawCard.misc_info[0] : null;
        const image: RawCardImage | null =
            rawCard.card_images != null ? rawCard.card_images[0] : null;
        const prices: RawCardPrices | null =
            rawCard.card_prices != null ? rawCard.card_prices[0] : null;
        return {
            id: rawCard.id,
            name: rawCard.name,
            desc: rawCard.desc,

            type: rawCard.type,
            race: rawCard.race,
            attribute: rawCard.attribute ?? null,
            atk: rawCard.atk ?? null,
            def: rawCard.def ?? null,
            level: rawCard.level ?? null,
            scale: rawCard.scale ?? null,
            linkval: rawCard.linkval ?? null,
            linkmarkers: rawCard.linkmarkers ?? null,

            sets:
                rawCard.card_sets?.map(rawSet => {
                    return {
                        name: rawSet.set_name,
                        code: rawSet.set_code,
                        rarity: rawSet.set_rarity,
                        price: rawSet.set_price
                    };
                }) ?? [],
            image:
                image != null
                    ? {
                          id: image.id,
                          url: image.image_url,
                          urlSmall: image.image_url_small
                      }
                    : null,
            prices:
                prices != null
                    ? {
                          cardmarket: prices.cardmarket_price,
                          tcgplayer: prices.tcgplayer_price,
                          ebay: prices.ebay_price,
                          amazon: prices.amazon_price
                      }
                    : null,

            betaName: miscInfo?.beta_name ?? null,
            treatedAs: miscInfo?.treated_as ?? null,
            archetype: rawCard.archetype ?? null,
            formats: miscInfo?.formats ?? [],
            release: {
                ocg: miscInfo?.ocg_date ?? null,
                tcg: miscInfo?.tcg_date ?? null
            },
            banlist: {
                tcg: mapBanListState(rawCard.banlist_info?.ban_tcg ?? null),
                ocg: mapBanListState(rawCard.banlist_info?.ban_ocg ?? null),
                goat: mapBanListState(rawCard.banlist_info?.ban_goat ?? null)
            },

            views: miscInfo?.views ?? 0
        };
    });

export { mapCardInfo };
