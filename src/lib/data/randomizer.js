import shuffle from "../shuffle";
import { ARCHETYPES } from "./archetypes";

const pickRandomArchetypes = (max = 1) => shuffle(ARCHETYPES).slice(0, max);

const checkArchetypeValidity = (card, archetypes, randChance) => {
    const cardName = card[1][0];

    return archetypes.some(
        archetype =>
            cardName.includes(archetype[0]) ||
            archetype[1].some(archetypeSub =>
                cardName.includes(archetypeSub)
            ) ||
            (archetype[2].some(archetypeSub =>
                cardName.includes(archetypeSub)
            ) &&
                Math.random() > 0.5) ||
            Math.random() < randChance
    );
};

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

            return card => checkArchetypeValidity(card, archetypes, 0.001);
        }
    },
    {
        name: "Two Archetypes",
        filterFactory: () => {
            const archetypes = pickRandomArchetypes(2);
            // eslint-disable-next-line no-console
            console.log(archetypes);

            return card => checkArchetypeValidity(card, archetypes, 0.0005);
        }
    },
    {
        name: "Three Archetypes",
        filterFactory: () => {
            const archetypes = pickRandomArchetypes(3);
            // eslint-disable-next-line no-console
            console.log(archetypes);

            return card => checkArchetypeValidity(card, archetypes, 0.00025);
        }
    }
];

Object.freeze(RANDOMIZER_MODES);

export { RANDOMIZER_MODES };
