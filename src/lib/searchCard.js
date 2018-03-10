const optionFilter = (val, filterItem) =>
    filterItem.active === "Any" ? true : val === filterItem.active;

const optionFilterArr = (val, filterItem) =>
    filterItem.active === "Any" ? true : val.includes(filterItem.active);

const searchCard = (cardArr, filter, is, sortFn) =>
    cardArr
        // Filter Text and other filters
        .filter(
            pair =>
                // Search Name
                pair[1][0].toLowerCase().includes(filter.name.toLowerCase()) &&
                // Search Type
                optionFilter(pair[1][1], filter.type) &&
                // Search Monster Sub
                (!is.monster || optionFilter(pair[1][6], filter.attribute)) &&
                (!is.monster || optionFilter(pair[1][5], filter.race)) &&
                (!is.monster || optionFilter(pair[1][4], filter.level)) &&
                (!is.monsterLink ||
                    optionFilterArr(pair[1][7], filter.linkarrows)) &&
                // Search Spell Sub
                (!is.spell || optionFilter(pair[1][5], filter.spelltype)) &&
                // Search Trap Sub
                (!is.trap || optionFilter(pair[1][5], filter.traptype))
        )
        // Apply sorting
        .sort((a, b) => sortFn(a[1], b[1]))
        // Drop everything but id and name
        .map(pair => [pair[0], pair[1][0]]);

export default searchCard;
