const RATIOS_DEFAULT = {
    monster: 1,
    spell: 0.9,
    trap: 0.75
};

const CHANCE_ADD_REQUIRED_ARCHETYPE_CARD = 0.85;
const CHANCE_ADD_OPTIONAL_CARD = 0.6;

Object.freeze(RATIOS_DEFAULT);

const getDefaultRatios = () => Object.assign({}, RATIOS_DEFAULT);

export {
    RATIOS_DEFAULT,
    CHANCE_ADD_REQUIRED_ARCHETYPE_CARD,
    CHANCE_ADD_OPTIONAL_CARD,
    getDefaultRatios
};
