import shuffle from "../shuffle";
import { ARCHETYPES } from "./archetypes";

const pickRandomArchetypes = (max = 1) => shuffle(ARCHETYPES).slice(0, max);

const RANDOMIZER_MODES = [
    { name: "Fully Random", filterFactory: () => () => true },
    /*{ name: "Single Attribute", filter: card => card },
    { name: "Single Race", filter: card => card }*/
    {
        name: "One Archetype",
        filterFactory: () => {
            const archetypes = pickRandomArchetypes(1);
            // eslint-disable-next-line no-console
            console.log(archetypes);

            return card =>
                archetypes.some(
                    archetype =>
                        card[1][0].toLowerCase().includes(archetype) ||
                        Math.random() > 0.999
                );
        }
    },
    {
        name: "Two Archetypes",
        filterFactory: () => {
            const archetypes = pickRandomArchetypes(2);
            // eslint-disable-next-line no-console
            console.log(archetypes);

            return card =>
                archetypes.some(
                    archetype =>
                        card[1][0].toLowerCase().includes(archetype) ||
                        Math.random() > 0.9995
                );
        }
    },
    {
        name: "Three Archetypes",
        filterFactory: () => {
            const archetypes = pickRandomArchetypes(3);
            // eslint-disable-next-line no-console
            console.log(archetypes);

            return card =>
                archetypes.some(
                    archetype =>
                        card[1][0].toLowerCase().includes(archetype) ||
                        Math.random() > 0.9999
                );
        }
    }
];

console.log(pickRandomArchetypes(3));

Object.freeze(RANDOMIZER_MODES);

export { RANDOMIZER_MODES };
