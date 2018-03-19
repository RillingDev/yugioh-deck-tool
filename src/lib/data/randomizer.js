import { randShuffle } from "lightdash";
import { ARCHETYPES } from "./archetypes";

const pickRandomArchetypes = (max = 1) => randShuffle(ARCHETYPES).slice(0, max);

const checkArchetypeValidity = (card, archetypes, randChance) => {
    const cardName = card[1].name.toLowerCase();

    return archetypes.some(
        archetype =>
            cardName.includes(archetype[0].toLowerCase()) ||
            archetype[1].some(archetypeSub => cardName === archetypeSub) ||
            (archetype[2].some(archetypeSub => cardName === archetypeSub) &&
                Math.random() > 0.5) ||
            Math.random() < randChance
    );
};

const RANDOMIZER_MODES = [
    { name: "Fully Random", filterFactory: () => () => true },
    {
        name: "One Archetype",
        filterFactory: () => {
            const archetypes = pickRandomArchetypes(1);

            // eslint-disable-next-line no-console
            console.log(archetypes.map(archetype => archetype[0]));

            return card => checkArchetypeValidity(card, archetypes, 0.001);
        }
    },
    {
        name: "Two Archetypes",
        filterFactory: () => {
            const archetypes = pickRandomArchetypes(2);

            // eslint-disable-next-line no-console
            console.log(archetypes.map(archetype => archetype[0]));

            return card => checkArchetypeValidity(card, archetypes, 0.0005);
        }
    },
    {
        name: "Three Archetypes",
        filterFactory: () => {
            const archetypes = pickRandomArchetypes(3);

            // eslint-disable-next-line no-console
            console.log(archetypes.map(archetype => archetype[0]));

            return card => checkArchetypeValidity(card, archetypes, 0.00025);
        }
    }
];

Object.freeze(RANDOMIZER_MODES);

export { RANDOMIZER_MODES };
