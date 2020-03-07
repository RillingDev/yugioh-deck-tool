const mapCardSets = (data) => data.map(rawCardSet => {
    return {
        name: rawCardSet.set_name,
        code: rawCardSet.set_code
    };
});
export { mapCardSets };
