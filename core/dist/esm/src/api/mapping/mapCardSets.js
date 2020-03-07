const mapCardSets = (data) => data.map(rawCardSet => {
    console.log(rawCardSet, rawCardSet.set_name);
    return {
        name: rawCardSet.set_name,
        code: rawCardSet.set_code
    };
});
export { mapCardSets };
