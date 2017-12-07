const searchCard = (cardArr, filter, sortFn) => {
    const filterText = pair => {
        const name = pair[1][0];

        return name.toLowerCase().includes(filter.name.toLowerCase());
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
        .sort((a, b) => sortFn(a[1], b[1]))
        .map(pair => [pair[0], pair[1][0]])
        .filter(filterDuplicates)
        .slice(0, 100);
};

export default searchCard;
