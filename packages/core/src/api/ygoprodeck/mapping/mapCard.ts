/* eslint-disable @typescript-eslint/naming-convention */

import {
    BanState,
    DEFAULT_BAN_STATE_ARR,
    DefaultBanState,
} from "../../../core/card/banlist/BanState";
import { CardImage } from "../../../core/card/CardImage";
import { CardPrices } from "../../../core/card/CardPrices";
import { CardSetAppearance } from "../../../core/card/set/CardSetAppearance";
import { Format } from "../../../core/card/format/Format";
import { DefaultVendor, Vendor } from "../../../core/price/Vendor";
import { UnlinkedCard } from "../../../core/card/UnlinkedCard";
import { ReleaseInfo } from "../../../core/card/ReleaseInfo";
import { findByValue, requireNonNilElseThrow } from "lightdash";

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
    views: number;
    viewsweek: number;
    upvotes: number;
    downvotes: number;
    treated_as?: string;
    beta_name?: string;
    formats?: string[];
    tcg_date?: string;
    ocg_date?: string;
}

interface RawBanlistInfo {
    ban_tcg?: string;
    ban_ocg?: string;
    ban_goat?: string;
}

const mapBanListState = (name: string | null): BanState => {
    for (const banState of DEFAULT_BAN_STATE_ARR) {
        if (name === banState.name) {
            return banState;
        }
    }
    return DefaultBanState.UNLIMITED;
};

const mapFormats = (rawMiscInfo: RawMiscInfo | null): Format[] => {
    if (rawMiscInfo == null || rawMiscInfo.formats == null) {
        return [];
    }
    return rawMiscInfo.formats.map((format) =>
        requireNonNilElseThrow(
            findByValue<Format>(Format, format),
            () => new TypeError(`Unexpected format '${format}'.`)
        )
    );
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
        putPrice(DefaultVendor.CARD_MARKET, prices.cardmarket_price);
        putPrice(DefaultVendor.TCG_PLAYER, prices.tcgplayer_price);
        putPrice(DefaultVendor.COOL_STUFF_INC, prices.coolstuffinc_price);
    }
    return result;
};

const mapRelease = (miscInfo: RawMiscInfo | null): ReleaseInfo => ({
    [Format.TCG]:
        miscInfo?.tcg_date != null
            ? new Date(miscInfo.tcg_date).getTime()
            : null,
    [Format.OCG]:
        miscInfo?.ocg_date != null
            ? new Date(miscInfo.ocg_date).getTime()
            : null,
});

const mapCard = (rawCard: RawCard): UnlinkedCard => {
    const miscInfo: RawMiscInfo | null =
        rawCard.misc_info != null ? rawCard.misc_info[0] : null;
    return {
        passcode: String(rawCard.id),
        name: rawCard.name,
        description: rawCard.desc,

        type: rawCard.type,
        subType: rawCard.race,
        attribute: rawCard.attribute ?? null,
        atk: rawCard.atk ?? null,
        def: rawCard.def ?? null,
        level: rawCard.level ?? null,
        pendulumScale: rawCard.scale ?? null,
        linkRating: rawCard.linkval ?? null,
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
};

export { mapCard, RawCard };
