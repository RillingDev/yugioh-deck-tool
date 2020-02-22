import deepFreeze from "../deepFreeze";
import { clone } from "lodash";

const CHANCE_ADD_REQUIRED_ARCHETYPE_CARD = 0.8;
const CHANCE_ADD_OPTIONAL_CARD = 0.7;

const CHANCE_ARCHETYPE_1_EXTRA = 0.003;
const CHANCE_ARCHETYPE_2_EXTRA = 0.002;
const CHANCE_ARCHETYPE_3_EXTRA = 0.001;

const RATIOS_DEFAULT = {
    monster: 1,
    spell: 0.9,
    trap: 0.8
};

deepFreeze(RATIOS_DEFAULT);

const getDefaultRatios = () => clone(RATIOS_DEFAULT);

export {
    CHANCE_ARCHETYPE_1_EXTRA,
    CHANCE_ARCHETYPE_2_EXTRA,
    CHANCE_ARCHETYPE_3_EXTRA,
    RATIOS_DEFAULT,
    CHANCE_ADD_REQUIRED_ARCHETYPE_CARD,
    CHANCE_ADD_OPTIONAL_CARD,
    getDefaultRatios
};
