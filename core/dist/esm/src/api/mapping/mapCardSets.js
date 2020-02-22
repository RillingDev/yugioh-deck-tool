const mapCardSets = (data) => data.map(rawCardSet => {
    var _a;
    return {
        name: rawCardSet.set_name,
        code: rawCardSet.set_code,
        cardCount: rawCardSet.num_of_cards,
        release: {
            tcg: (_a = rawCardSet.tcg_date, (_a !== null && _a !== void 0 ? _a : null)),
            ocg: null
        }
    };
});
export { mapCardSets };
//# sourceMappingURL=mapCardSets.js.map