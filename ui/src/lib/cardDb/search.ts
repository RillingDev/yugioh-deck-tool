const optionFilter = (val, filterItem) =>
    filterItem.active === "Any" ? true : val === filterItem.active;

const optionFilterArr = (val, filterItem) => {
    if (filterItem.active === "Any") {
        return true;
    }
    return val != null && val.includes(filterItem.active);
};

const searchCard = (cardArr, filter, is, sortFn) => {
    const filterNameLower = filter.name.toLowerCase();
    const sets = filter.sets.active == null ? [] : filter.sets.active;

    return (
        cardArr
            // Filter Text and other filters
            .filter(pair => {
                const pairData = pair[1];
                const cardNameLower = pairData.name.toLowerCase();

                return (
                    // Search Set
                    (sets.length === 0 ||
                        sets.some(set =>
                            pairData.sets.some(
                                setAppearance => setAppearance.name === set.name
                            )
                        )) &&
                    // Search Format
                    filter.format.active.check(pairData) &&
                    filter.banlist.active.check(pairData) &&
                    // Search name
                    cardNameLower.includes(filterNameLower) &&
                    // Search Type
                    optionFilter(pairData.type, filter.type) &&
                    // Search Monster Sub
                    (!is.monster ||
                        optionFilter(pairData.attribute, filter.attribute)) &&
                    (!is.monster || optionFilter(pairData.race, filter.race)) &&
                    (!is.monster ||
                        optionFilter(String(pairData.level), filter.level)) &&
                    (!is.monsterLink ||
                        optionFilterArr(
                            pairData.linkmarkers,
                            filter.linkmarkers
                        )) &&
                    // Search Spell sub
                    (!is.spell ||
                        optionFilter(pairData.race, filter.spelltype)) &&
                    // Search Trap sub
                    (!is.trap || optionFilter(pairData.race, filter.traptype))
                );
            })
            // Apply sorting
            .sort((a, b) => sortFn(a[1], b[1]))
    );
};

export default searchCard;
