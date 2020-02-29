const mapCardSets = (data) => data.map(rawCardSet => {
    return {
        name: rawCardSet.set_name,
        code: rawCardSet.set_code,
        cardCount: rawCardSet.num_of_cards,
        release: {
            tcg: rawCardSet.tcg_date ?? null,
            ocg: null // Not exposed yet
        }
    };
});
export { mapCardSets };
//# sourceMappingURL=mapCardSets.js.map