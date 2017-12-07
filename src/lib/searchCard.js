const searchCard = (cardArr, filter, sortFn) => {
    const filterText = pair => {
        const name = pair[1][0];

        return name.toLowerCase().includes(filter.name.toLowerCase());
    };
    const filterType = pair => {
        if (filter.type.active === "Any") {
            return true;
        } else {
            return pair[1][3] === filter.type.active;
        }
    };
    const filterDuplicates = pair => {
        const name = pair[1];

        if (nameCache.has(name)) {
            return false;
        } else {
            nameCache.add(name);

            return true;
        }
    };
    const nameCache = new Set();

    /**
     * Flow:
     *      1) Filter Text search
     *      2) Apply sorting
     *      3) Drop everything but id and name
     *      4) Drop duplicates
     *      5) Take 100 first results
     */
    return cardArr
        .filter(filterText)
        .filter(filterType)
        .sort((a, b) => sortFn(a[1], b[1]))
        .map(pair => [pair[0], pair[1][0]])
        .filter(filterDuplicates)
        .slice(0, 100);
};

export default searchCard;
