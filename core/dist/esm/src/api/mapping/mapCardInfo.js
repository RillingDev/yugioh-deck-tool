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
const mapCardInfo = (data) => data.map(rawCard => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    const miscInfo = rawCard.misc_info != null ? rawCard.misc_info[0] : null;
    const image = rawCard.card_images != null ? rawCard.card_images[0] : null;
    const prices = rawCard.card_prices != null ? rawCard.card_prices[0] : null;
    return {
        id: rawCard.id,
        name: rawCard.name,
        desc: rawCard.desc,
        type: rawCard.type,
        race: rawCard.race,
        attribute: (_a = rawCard.attribute, (_a !== null && _a !== void 0 ? _a : null)),
        atk: (_b = rawCard.atk, (_b !== null && _b !== void 0 ? _b : null)),
        def: (_c = rawCard.def, (_c !== null && _c !== void 0 ? _c : null)),
        level: (_d = rawCard.level, (_d !== null && _d !== void 0 ? _d : null)),
        scale: (_e = rawCard.scale, (_e !== null && _e !== void 0 ? _e : null)),
        linkval: (_f = rawCard.linkval, (_f !== null && _f !== void 0 ? _f : null)),
        linkmarkers: (_g = rawCard.linkmarkers, (_g !== null && _g !== void 0 ? _g : null)),
        sets: (_j = (_h = rawCard.card_sets) === null || _h === void 0 ? void 0 : _h.map(rawSet => {
            return {
                name: rawSet.set_name,
                code: rawSet.set_code,
                rarity: rawSet.set_rarity,
                price: rawSet.set_price
            };
        }), (_j !== null && _j !== void 0 ? _j : [])),
        image: image != null
            ? {
                id: image.id,
                url: image.image_url,
                urlSmall: image.image_url_small
            }
            : null,
        prices: prices != null
            ? {
                cardmarket: Number(prices.cardmarket_price),
                tcgplayer: Number(prices.tcgplayer_price),
                ebay: Number(prices.ebay_price),
                amazon: Number(prices.amazon_price)
            }
            : null,
        betaName: (_l = (_k = miscInfo) === null || _k === void 0 ? void 0 : _k.beta_name, (_l !== null && _l !== void 0 ? _l : null)),
        treatedAs: (_o = (_m = miscInfo) === null || _m === void 0 ? void 0 : _m.treated_as, (_o !== null && _o !== void 0 ? _o : null)),
        archetype: (_p = rawCard.archetype, (_p !== null && _p !== void 0 ? _p : null)),
        formats: (_r = (_q = miscInfo) === null || _q === void 0 ? void 0 : _q.formats, (_r !== null && _r !== void 0 ? _r : [])),
        release: {
            ocg: (_t = (_s = miscInfo) === null || _s === void 0 ? void 0 : _s.ocg_date, (_t !== null && _t !== void 0 ? _t : null)),
            tcg: (_v = (_u = miscInfo) === null || _u === void 0 ? void 0 : _u.tcg_date, (_v !== null && _v !== void 0 ? _v : null))
        },
        banlist: {
            tcg: mapBanListState((_x = (_w = rawCard.banlist_info) === null || _w === void 0 ? void 0 : _w.ban_tcg, (_x !== null && _x !== void 0 ? _x : null))),
            ocg: mapBanListState((_z = (_y = rawCard.banlist_info) === null || _y === void 0 ? void 0 : _y.ban_ocg, (_z !== null && _z !== void 0 ? _z : null))),
            goat: mapBanListState((_1 = (_0 = rawCard.banlist_info) === null || _0 === void 0 ? void 0 : _0.ban_goat, (_1 !== null && _1 !== void 0 ? _1 : null)))
        },
        views: (_3 = (_2 = miscInfo) === null || _2 === void 0 ? void 0 : _2.views, (_3 !== null && _3 !== void 0 ? _3 : 0))
    };
});
export { mapCardInfo };
//# sourceMappingURL=mapCardInfo.js.map