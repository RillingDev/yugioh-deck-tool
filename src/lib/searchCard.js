const optionFilter = (val, filterItem) =>
    filterItem.active === "Any" ? true : val === filterItem.active;

const optionFilterArr = (val, filterItem) =>
    filterItem.active === "Any" ? true : val.includes(filterItem.active);

const searchCard = (cardArr, filter, is, sortFn) => {
    const filterNameLower = filter.name.toLowerCase();

    return (
        cardArr
        // Filter Text and other filters
        .filter(pair => {
            const pairData = pair[1];
            const cardNameLower = pairData.name.toLowerCase();

            return (
                // Search Name
                cardNameLower.includes(filterNameLower) &&
                // Search Format
                filter.format.active.check(pairData) &&
                filter.banlist.active.check(pairData) &&
                // Search Type
                optionFilter(pairData.type, filter.type) &&
                // Search Monster Sub
                (!is.monster ||
                    optionFilter(pairData.attribute, filter.attribute)) &&
                (!is.monster || optionFilter(pairData.race, filter.race)) &&
                (!is.monster ||
                    optionFilter(
                        String(pairData.stats[2]),
                        filter.level
                    )) &&
                (!is.monsterLink ||
                    optionFilterArr(
                        pairData.linkarrows,
                        filter.linkarrows
                    )) &&
                // Search Spell Sub
                (!is.spell ||
                    optionFilter(pairData.race, filter.spelltype)) &&
                // Search Trap Sub
                (!is.trap || optionFilter(pairData.race, filter.traptype))
            );
        })
        // Apply sorting
        .sort((a, b) => sortFn(a[1], b[1]))
    );
};

export default searchCard;
