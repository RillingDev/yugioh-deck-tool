import { BanState } from "../../core/model/BanState";
import { Format } from "../../core/model/Format";
const mapBanListState = (name) => {
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
const mapFormats = (rawMiscInfo) => {
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
        return Format.UNKNOWN;
    });
};
const mapCardSets = (rawCard) => {
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
const mapImage = (rawCard) => {
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
const mapPrices = (rawCard) => {
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
const mapCardInfo = (data) => {
    return data.map(rawCard => {
        const miscInfo = rawCard.misc_info != null ? rawCard.misc_info[0] : null;
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
            linkval: rawCard.linkval ?? null,
            linkmarkers: rawCard.linkmarkers ?? null,
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
                [Format.TCG]: mapBanListState(rawCard.banlist_info?.ban_tcg ?? null),
                [Format.OCG]: mapBanListState(rawCard.banlist_info?.ban_ocg ?? null),
                [Format.GOAT]: mapBanListState(rawCard.banlist_info?.ban_goat ?? null)
            },
            views: miscInfo?.views ?? 0
        };
    });
};
export { mapCardInfo };
