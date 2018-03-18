import { randShuffle, arrFlattenDeep } from "lightdash";
import { ARCHETYPES } from "./archetypes";

const pickRandomArchetypes = (max = 1) => randShuffle(ARCHETYPES).slice(0, max);

const checkArchetypeValidity = (card, archetypes, randChance) => {
    const cardName = card[1][0].toLowerCase();

    return archetypes.some(
        archetype =>
            cardName.includes(archetype[0].toLowerCase()) ||
            (archetype[2].some(archetypeSub => cardName === archetypeSub) &&
                Math.random() > 0.5) ||
            Math.random() < randChance
    );
};

const archetypeSplitterFactory = (shuffledPairs, archetypes, randChance) => {
    const requiredCardNames = arrFlattenDeep(
        archetypes.map(archetype => archetype[1])
    );
    const requiredCards = shuffledPairs.filter(card => card[1][0]);

    console.log({
        requiredCardNames,
        archetypes: archetypes.map(archetype => archetype[0]).join("+")
    });

    // eslint-disable-next-line no-console
    //console.log(archetypes.map(archetype => archetype[0]), requiredCards);

    //return card => checkArchetypeValidity(card, archetypes, randChance);

    return { primary: shuffledPairs, required: [] };
};

const RANDOMIZER_MODES = [
    {
        name: "Fully Random",
        splitter: shuffledPairs => {
            return { primary: shuffledPairs, required: [] };
        }
    },
    {
        name: "One Archetype",
        splitter: shuffledPairs =>
            archetypeSplitterFactory(
                shuffledPairs,
                pickRandomArchetypes(1),
                0.001
            )
    }
    /*     {
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
        } */
];

Object.freeze(RANDOMIZER_MODES);

export { RANDOMIZER_MODES };
