const mapCardInfo = (data) => data.map(rawCard => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const miscInfo = rawCard.misc_info != null ? rawCard.misc_info[0] : null;
    const image = rawCard.card_images != null ? rawCard.card_images[0] : null;
    const prices = rawCard.card_prices != null ? rawCard.card_prices[0] : null;
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
        image: image != null ?
            {
                id: image.id,
                url: image.image_url,
                urlSmall: image.image_url_small
            }
            : null,
        prices: prices != null ?
            {
                cardmarket: prices.cardmarket_price,
                tcgplayer: prices.tcgplayer_price,
                ebay: prices.ebay_price,
                amazon: prices.amazon_price
            } : null,
        betaName: (_d = (_c = miscInfo) === null || _c === void 0 ? void 0 : _c.beta_name, (_d !== null && _d !== void 0 ? _d : null)),
        treatedAs: (_f = (_e = miscInfo) === null || _e === void 0 ? void 0 : _e.treated_as, (_f !== null && _f !== void 0 ? _f : null)),
        archetype: (_g = rawCard.archetype, (_g !== null && _g !== void 0 ? _g : null)),
        formats: (_j = (_h = miscInfo) === null || _h === void 0 ? void 0 : _h.formats, (_j !== null && _j !== void 0 ? _j : [])),
        release: {
            ocg: (_l = (_k = miscInfo) === null || _k === void 0 ? void 0 : _k.ocg_date, (_l !== null && _l !== void 0 ? _l : null)),
            tcg: (_o = (_m = miscInfo) === null || _m === void 0 ? void 0 : _m.tcg_date, (_o !== null && _o !== void 0 ? _o : null))
        },
        banlist: {
            tcg: (_q = (_p = rawCard.banlist_info) === null || _p === void 0 ? void 0 : _p.ban_tcg, (_q !== null && _q !== void 0 ? _q : null)),
            ocg: (_s = (_r = rawCard.banlist_info) === null || _r === void 0 ? void 0 : _r.ban_ocg, (_s !== null && _s !== void 0 ? _s : null)),
            goat: (_u = (_t = rawCard.banlist_info) === null || _t === void 0 ? void 0 : _t.ban_goat, (_u !== null && _u !== void 0 ? _u : null))
        },
        views: (_w = (_v = miscInfo) === null || _v === void 0 ? void 0 : _v.views, (_w !== null && _w !== void 0 ? _w : 0))
    };
});
export { mapCardInfo };
