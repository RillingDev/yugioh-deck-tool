import { BanState } from "../../core/model/BanState";
import { CardImage } from "../../core/model/CardImage";
import { CardPrices } from "../../core/model/CardPrices";
import { CardSetAppearance } from "../../core/model/CardSetAppearance";
import { Format } from "../../core/model/Format";
import { UnlinkedCard } from "../../core/business/CardDataLoaderService";

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

const mapFormats = (rawMiscInfo: RawMiscInfo | null): Format[] => {
    if (rawMiscInfo == null || rawMiscInfo.formats == null) {
        return [];
    }
    return rawMiscInfo.formats.map(format => {
        if (format === "TCG") {
            return Format.TCG;
        }
        if (format === "OCG") {
            return Format.OCG;
        }
        if (format === "GOAT") {
            return Format.GOAT;
        }
        if (format === "OCG GOAT") {
            return Format.OCG_GOAT;
        }
        if (format === "Speed Duel") {
            return Format.SPEED_DUEL;
        }
        if (format === "Rush Duel") {
            return Format.RUSH_DUEL;
        }
        if (format === "Duel Links") {
            return Format.DUEL_LINKS;
        }
        console.warn(
            `Encountered unknown format ${format}, attempting to continue.`
        );
        return Format.UNKNOWN;
    });
};

const mapCardSets = (rawCard: RawCard): CardSetAppearance[] => {
    if (rawCard.card_sets == null) {
        return [];
    }
    return rawCard.card_sets.map(rawSet => {
        return {
            name: rawSet.set_name,
            code: rawSet.set_code,
            rarity: rawSet.set_rarity,
            price: rawSet.set_price
        };
    });
};

const mapImage = (rawCard: RawCard): CardImage | null => {
    if (rawCard.card_images == null) {
        return null;
    }
    const image = rawCard.card_images[0];
    return {
        id: image.id,
        url: image.image_url,
        urlSmall: image.image_url_small
    };
};

const mapPrices = (rawCard: RawCard): CardPrices | null => {
    if (rawCard.card_prices == null) {
        return null;
    }
    const prices = rawCard.card_prices[0];
    return {
        cardmarket: Number(prices.cardmarket_price),
        tcgplayer: Number(prices.tcgplayer_price),
        ebay: Number(prices.ebay_price),
        amazon: Number(prices.amazon_price)
    };
};

const mapCardInfo = (data: RawCard[]): UnlinkedCard[] => {
    return data.map(rawCard => {
        const miscInfo: RawMiscInfo | null =
            rawCard.misc_info != null ? rawCard.misc_info[0] : null;
        return {
            id: String(rawCard.id),
            name: rawCard.name,
            desc: rawCard.desc,

            type: rawCard.type,
            race: rawCard.race,
            attribute: rawCard.attribute ?? null,
            atk: rawCard.atk ?? null,
            def: rawCard.def ?? null,
            level: rawCard.level ?? null,
            scale: rawCard.scale ?? null,
            linkVal: rawCard.linkval ?? null,
            linkMarkers: rawCard.linkmarkers ?? null,

            sets: mapCardSets(rawCard),
            image: mapImage(rawCard),
            prices: mapPrices(rawCard),

            betaName: miscInfo?.beta_name ?? null,
            treatedAs: miscInfo?.treated_as ?? null,
            archetype: rawCard.archetype ?? null,
            formats: mapFormats(miscInfo),
            release: {
                [Format.TCG]: miscInfo?.tcg_date ?? null,
                [Format.OCG]: miscInfo?.ocg_date ?? null
            },
            banlist: {
                [Format.TCG]: mapBanListState(
                    rawCard.banlist_info?.ban_tcg ?? null
                ),
                [Format.OCG]: mapBanListState(
                    rawCard.banlist_info?.ban_ocg ?? null
                ),
                [Format.GOAT]: mapBanListState(
                    rawCard.banlist_info?.ban_goat ?? null
                )
            },

            views: miscInfo?.views ?? 0
        };
    });
};

export { mapCardInfo, RawCard };
