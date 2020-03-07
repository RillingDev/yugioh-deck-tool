import { BanState } from "../../core/model/BanState";
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        const miscInfo = rawCard.misc_info != null ? rawCard.misc_info[0] : null;
        return {
            id: rawCard.id,
            name: rawCard.name,
            desc: rawCard.desc,
            type: rawCard.type,
            race: rawCard.race,
            attribute: (_a = rawCard.attribute) !== null && _a !== void 0 ? _a : null,
            atk: (_b = rawCard.atk) !== null && _b !== void 0 ? _b : null,
            def: (_c = rawCard.def) !== null && _c !== void 0 ? _c : null,
            level: (_d = rawCard.level) !== null && _d !== void 0 ? _d : null,
            scale: (_e = rawCard.scale) !== null && _e !== void 0 ? _e : null,
            linkval: (_f = rawCard.linkval) !== null && _f !== void 0 ? _f : null,
            linkmarkers: (_g = rawCard.linkmarkers) !== null && _g !== void 0 ? _g : null,
            sets: mapCardSets(rawCard),
            image: mapImage(rawCard),
            prices: mapPrices(rawCard),
            betaName: (_h = miscInfo === null || miscInfo === void 0 ? void 0 : miscInfo.beta_name) !== null && _h !== void 0 ? _h : null,
            treatedAs: (_j = miscInfo === null || miscInfo === void 0 ? void 0 : miscInfo.treated_as) !== null && _j !== void 0 ? _j : null,
            archetype: (_k = rawCard.archetype) !== null && _k !== void 0 ? _k : null,
            formats: (_l = miscInfo === null || miscInfo === void 0 ? void 0 : miscInfo.formats) !== null && _l !== void 0 ? _l : [],
            release: {
                ocg: (_m = miscInfo === null || miscInfo === void 0 ? void 0 : miscInfo.ocg_date) !== null && _m !== void 0 ? _m : null,
                tcg: (_o = miscInfo === null || miscInfo === void 0 ? void 0 : miscInfo.tcg_date) !== null && _o !== void 0 ? _o : null
            },
            banlist: {
                tcg: mapBanListState((_q = (_p = rawCard.banlist_info) === null || _p === void 0 ? void 0 : _p.ban_tcg) !== null && _q !== void 0 ? _q : null),
                ocg: mapBanListState((_s = (_r = rawCard.banlist_info) === null || _r === void 0 ? void 0 : _r.ban_ocg) !== null && _s !== void 0 ? _s : null),
                goat: mapBanListState((_u = (_t = rawCard.banlist_info) === null || _t === void 0 ? void 0 : _t.ban_goat) !== null && _u !== void 0 ? _u : null)
            },
            views: (_v = miscInfo === null || miscInfo === void 0 ? void 0 : miscInfo.views) !== null && _v !== void 0 ? _v : 0
        };
    });
};
export { mapCardInfo };
//# sourceMappingURL=mapCardInfo.js.map