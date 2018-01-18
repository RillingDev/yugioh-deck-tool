const optionFilter = (val, filterItem) =>
    filterItem.active === "Any" ? true : val === filterItem.active;

const optionFilterArr = (val, filterItem) =>
    filterItem.active === "Any" ? true : val.includes(filterItem.active);

const searchCard = (cardArr, filter, is, sortFn) => {
    const filterFilters = pair => {
        return (
            pair[1][0].toLowerCase().includes(filter.name.toLowerCase()) &&
            optionFilter(pair[1][1], filter.type) &&
            (!is.monster || optionFilter(pair[1][6], filter.attribute)) &&
            (!is.monster || optionFilter(pair[1][5], filter.race)) &&
            (!is.monster || optionFilter(pair[1][4], filter.level)) &&
            (!is.monsterLink ||
                optionFilterArr(pair[1][7], filter.linkarrows)) &&
            (!is.spell || optionFilter(pair[1][5], filter.spelltype)) &&
            (!is.trap || optionFilter(pair[1][5], filter.traptype))
        );
    };
    const filterDuplicates = pair => {
        if (nameCache.has(pair[1])) {
            return false;
        } else {
            nameCache.add(pair[1]);

            return true;
        }
    };
    const nameCache = new Set();

    /**
     * Flow:
     *      1) Filter Text and other filters
     *      2) Apply sorting
     *      3) Drop everything but id and name
     *      4) Drop duplicates
     *      5) Take 100 first results
     */
    return cardArr
        .filter(filterFilters)
        .sort((a, b) => sortFn(a[1], b[1]))
        .map(pair => [pair[0], pair[1][0]])
        .filter(filterDuplicates)
        .slice(0, 100);
};

export default searchCard;
