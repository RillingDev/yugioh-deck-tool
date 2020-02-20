const mapCardInfo = (data) => data.map(rawCard => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const miscInfo = rawCard.misc_info != null ? rawCard.misc_info[0] : null;
    return {
        id: rawCard.id,
        name: rawCard.name,
        desc: rawCard.desc,
        type: rawCard.type,
        race: rawCard.race,
        attribute: rawCard.attribute,
        atk: rawCard.atk,
        def: rawCard.def,
        level: rawCard.level,
        scale: rawCard.scale,
        linkval: rawCard.linkval,
        linkmarkers: rawCard.linkmarkers,
        sets: (_b = (_a = rawCard.card_sets) === null || _a === void 0 ? void 0 : _a.map(rawSet => {
            return {
                name: rawSet.set_name,
                code: rawSet.set_code,
                rarity: rawSet.set_rarity,
                price: rawSet.set_price
            };
        }), (_b !== null && _b !== void 0 ? _b : [])),
        images: (_d = (_c = rawCard.card_images) === null || _c === void 0 ? void 0 : _c.map(rawImage => {
            return {
                id: rawImage.id,
                url: rawImage.image_url,
                urlSmall: rawImage.image_url_small
            };
        }), (_d !== null && _d !== void 0 ? _d : [])),
        prices: (_f = (_e = rawCard.card_prices) === null || _e === void 0 ? void 0 : _e.map(rawPrice => {
            return {
                cardmarket: rawPrice.cardmarket_price,
                tcgplayer: rawPrice.tcgplayer_price,
                ebay: rawPrice.ebay_price,
                amazon: rawPrice.amazon_price
            };
        }), (_f !== null && _f !== void 0 ? _f : [])),
        betaName: (_h = (_g = miscInfo) === null || _g === void 0 ? void 0 : _g.beta_name, (_h !== null && _h !== void 0 ? _h : null)),
        treatedAs: (_k = (_j = miscInfo) === null || _j === void 0 ? void 0 : _j.treated_as, (_k !== null && _k !== void 0 ? _k : null)),
        archetype: (_l = rawCard.archetype, (_l !== null && _l !== void 0 ? _l : null)),
        formats: (_o = (_m = miscInfo) === null || _m === void 0 ? void 0 : _m.formats, (_o !== null && _o !== void 0 ? _o : [])),
        release: {
            ocg: (_q = (_p = miscInfo) === null || _p === void 0 ? void 0 : _p.ocg_date, (_q !== null && _q !== void 0 ? _q : null)),
            tcg: (_s = (_r = miscInfo) === null || _r === void 0 ? void 0 : _r.tcg_date, (_s !== null && _s !== void 0 ? _s : null))
        },
        banlist: {
            tcg: (_u = (_t = rawCard.banlist_info) === null || _t === void 0 ? void 0 : _t.ban_tcg, (_u !== null && _u !== void 0 ? _u : null)),
            ocg: (_w = (_v = rawCard.banlist_info) === null || _v === void 0 ? void 0 : _v.ban_ocg, (_w !== null && _w !== void 0 ? _w : null)),
            goat: (_y = (_x = rawCard.banlist_info) === null || _x === void 0 ? void 0 : _x.ban_goat, (_y !== null && _y !== void 0 ? _y : null))
        },
        views: (_0 = (_z = miscInfo) === null || _z === void 0 ? void 0 : _z.views, (_0 !== null && _0 !== void 0 ? _0 : 0))
    };
});
export { mapCardInfo };
