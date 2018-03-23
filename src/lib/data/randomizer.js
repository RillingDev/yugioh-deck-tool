import { randShuffle } from "lightdash";
import { ARCHETYPES } from "./archetypes";
import { archetypePoolFactory } from "../randomize";

const getRandomArchetypes = (max = 1) => randShuffle(ARCHETYPES).slice(0, max);

const RANDOMIZER_MODES = [
    {
        name: "Fully Random",
        getPools: pairsArrUniq => {
            return {
                main: pairsArrUniq,
                required: []
            };
        }
    },
    {
        name: "One Archetype",
        getPools: pairsArrUniq =>
            archetypePoolFactory(pairsArrUniq, getRandomArchetypes(1), 0.005)
    },
    {
        name: "Two Archetypes",
        getPools: pairsArrUniq =>
            archetypePoolFactory(pairsArrUniq, getRandomArchetypes(2), 0.0025)
    },
    {
        name: "Three Archetypes",
        getPools: pairsArrUniq =>
            archetypePoolFactory(pairsArrUniq, getRandomArchetypes(3), 0.00125)
    }
];

Object.freeze(RANDOMIZER_MODES);

export { RANDOMIZER_MODES };
