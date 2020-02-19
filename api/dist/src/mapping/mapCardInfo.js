const mapCardInfo = (data) => data.map(rawCard => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
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
        release: miscInfo != null ? {
            ocg: (_p = miscInfo.ocg_date, (_p !== null && _p !== void 0 ? _p : null)),
            tcg: (_q = miscInfo.tcg_date, (_q !== null && _q !== void 0 ? _q : null))
        } : null,
        banlist: rawCard.banlist_info != null ? {
            tcg: (_r = rawCard.banlist_info.ban_tcg, (_r !== null && _r !== void 0 ? _r : null)),
            ocg: (_s = rawCard.banlist_info.ban_ocg, (_s !== null && _s !== void 0 ? _s : null)),
            goat: (_t = rawCard.banlist_info.ban_goat, (_t !== null && _t !== void 0 ? _t : null))
        } : null,
        views: (_v = (_u = miscInfo) === null || _u === void 0 ? void 0 : _u.views, (_v !== null && _v !== void 0 ? _v : 0))
    };
});
export { mapCardInfo };
