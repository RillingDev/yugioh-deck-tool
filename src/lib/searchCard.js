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
                const optionFilterPattern = (
                    cond,
                    index,
                    filterItem,
                    optionFn = optionFilter
                ) => !cond || optionFn(pair[1][index], filterItem);

                return (
                    // Search Name
                    pair[1][0].toLowerCase().includes(filterNameLower) &&
                    // Search Format
                    filter.format.active.check(pair[1]) &&
                    filter.banlist.active.check(pair[1]) &&
                    // Search Type
                    optionFilter(pair[1][1], filter.type) &&
                    // Search Monster Sub
                    optionFilterPattern(is.monster, 6, filter.attribute) &&
                    optionFilterPattern(is.monster, 5, filter.race) &&
                    optionFilterPattern(is.monster, 4, filter.level) &&
                    optionFilterPattern(
                        is.monsterLink,
                        7,
                        filter.linkarrows,
                        optionFilterArr
                    ) &&
                    // Search Spell Sub
                    optionFilterPattern(is.spell, 5, filter.spelltype) &&
                    // Search Trap Sub
                    optionFilterPattern(is.trap, 5, filter.traptype)
                );
            })
            // Apply sorting
            .sort((a, b) => sortFn(a[1], b[1]))
            // Drop everything but id and name
            .map(pair => [pair[0], pair[1][0]])
    );
};

export default searchCard;
