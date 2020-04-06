import { BanState, DefaultBanState } from "../../../core/model/ygo/BanState";
import { CardImage } from "../../../core/model/ygo/CardImage";
import { CardPrices } from "../../../core/model/ygo/CardPrices";
import { CardSetAppearance } from "../../../core/model/ygo/intermediate/CardSetAppearance";
import { Format } from "../../../core/model/ygo/Format";
import { DefaultVendor, Vendor } from "../../../core/model/price/Vendor";
import { UnlinkedCard } from "../../../core/model/ygo/intermediate/UnlinkedCard";
import { ReleaseInfo } from "../../../core/model/ygo/ReleaseInfo";

// https://jvilk.com/MakeTypes/
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

const mapBanListState = (name: string | null): BanState => {
    if (name === "Banned") {
        return DefaultBanState.BANNED;
    }
    if (name === "Limited") {
        return DefaultBanState.LIMITED;
    }
    if (name === "Semi-Limited") {
        return DefaultBanState.SEMI_LIMITED;
    }
    return DefaultBanState.UNLIMITED;
};

const mapFormats = (rawMiscInfo: RawMiscInfo | null): Format[] => {
    if (rawMiscInfo == null || rawMiscInfo.formats == null) {
        return [];
    }
    return rawMiscInfo.formats.map((format) => {
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
        throw new TypeError(`Unexpected format '${format}'.`);
    });
};

const mapCardSets = (rawCard: RawCard): CardSetAppearance[] => {
    if (rawCard.card_sets == null) {
        return [];
    }
    return rawCard.card_sets.map((rawSet) => {
        return {
            name: rawSet.set_name,
            code: rawSet.set_code,
        };
    });
};

// Map back against main source instead of google's CDN.
const mapCardImage = (imageUrl: string): string =>
    imageUrl.replace(
        "https://storage.googleapis.com/ygoprodeck.com/",
        "https://ygoprodeck.com/"
    );

const mapImage = (rawCard: RawCard): CardImage | null => {
    if (rawCard.card_images == null) {
        return null;
    }
    const image = rawCard.card_images[0];
    return {
        url: mapCardImage(image.image_url),
        urlSmall: mapCardImage(image.image_url_small),
    };
};

const mapPrices = (rawCard: RawCard): CardPrices => {
    const result = new Map<Vendor, number>();
    if (rawCard.card_prices != null) {
        const putPrice = (vendor: Vendor, price: string): void => {
            const priceValue = Number(price);

            // API puts "0" for no price, we skip those
            if (priceValue > 0) {
                result.set(vendor, priceValue);
            }
        };
        const prices = rawCard.card_prices[0];
        putPrice(DefaultVendor.CARDMARKET, prices.cardmarket_price);
        putPrice(DefaultVendor.TCGPLAYER, prices.tcgplayer_price);
        putPrice(DefaultVendor.COOL_STUFF_INC, prices.coolstuffinc_price);
        putPrice(DefaultVendor.EBAY, prices.ebay_price);
        putPrice(DefaultVendor.AMAZON, prices.amazon_price);
    }
    return result;
};

const mapRelease = (miscInfo: RawMiscInfo | null): ReleaseInfo => ({
    [Format.TCG]:
        miscInfo?.tcg_date != null
            ? new Date(miscInfo.tcg_date).getTime()
            : Infinity,
    [Format.OCG]:
        miscInfo?.ocg_date != null
            ? new Date(miscInfo.ocg_date).getTime()
            : Infinity,
});

const mapCardInfo = (data: RawCard[]): UnlinkedCard[] => {
    return data.map((rawCard) => {
        const miscInfo: RawMiscInfo | null =
            rawCard.misc_info != null ? rawCard.misc_info[0] : null;
        return {
            id: String(rawCard.id),
            name: rawCard.name,

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
            release: mapRelease(miscInfo),
            banlist: {
                [Format.TCG]: mapBanListState(
                    rawCard.banlist_info?.ban_tcg ?? null
                ),
                [Format.OCG]: mapBanListState(
                    rawCard.banlist_info?.ban_ocg ?? null
                ),
                [Format.GOAT]: mapBanListState(
                    rawCard.banlist_info?.ban_goat ?? null
                ),
            },

            views: miscInfo?.views ?? 0,
        };
    });
};

export { mapCardInfo, RawCard };
