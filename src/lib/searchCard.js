const optionFilter = (val, filterItem) =>
    filterItem.active === "Any" ? true : val === filterItem.active;

const optionFilterArr = (val, filterItem) =>
    filterItem.active === "Any" ? true : val.includes(filterItem.active);

const searchCard = (cardArr, filter, isMonster, isMonsterLink, sortFn) => {
    const filterFilters = pair => {
        return (
            pair[1][0].toLowerCase().includes(filter.name.toLowerCase()) &&
            optionFilter(pair[1][1], filter.type) &&
            (!isMonster || optionFilter(pair[1][6], filter.attribute)) &&
            (!isMonster || optionFilter(pair[1][5], filter.race)) &&
            (!isMonster || optionFilter(pair[1][4], filter.level)) &&
            (!isMonsterLink || optionFilterArr(pair[1][7], filter.linkarrows))
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
