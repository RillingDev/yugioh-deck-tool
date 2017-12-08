const optionFilter = (val, filterItem) =>
    filterItem.active === "Any" ? true : val === filterItem.active;

const searchCard = (cardArr, filter, isFilterExpanded, sortFn) => {
    const filterFilters = pair => {
        return (
            pair[1][0].toLowerCase().includes(filter.name.toLowerCase()) &&
            optionFilter(pair[1][3], filter.type) &&
            (!isFilterExpanded || optionFilter(pair[1][8], filter.attribute)) &&
            (!isFilterExpanded || optionFilter(pair[1][7], filter.race)) &&
            (!isFilterExpanded || optionFilter(pair[1][6], filter.level))
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
