import { randShuffle, arrFlattenDeep, arrUniq } from "lightdash";
import { ARCHETYPES } from "./archetypes";

const pickRandomArchetypes = (max = 1) => randShuffle(ARCHETYPES).slice(0, max);

/* const checkArchetypeValidity = (card, archetypes, randChance) => {
    const cardName = card[1].name.toLowerCase();

    return archetypes.some(
        archetype =>
            cardName.includes(archetype[0].toLowerCase()) ||
            (archetype[2].some(archetypeSub => cardName === archetypeSub) &&
                Math.random() > 0.5) ||
            Math.random() < randChance
    );
}; */

const archetypeSplitterFactory = (shuffledPairs, archetypes, randChance) => {
    const namesMain = archetypes.map(archetype => archetype[0]);
    const namesRequired = arrUniq(
        arrFlattenDeep(archetypes.map(archetype => archetype[1]))
    );
    const namesOptional = arrUniq(
        arrFlattenDeep(archetypes.map(archetype => archetype[2]))
    );
    const requiredPool = shuffledPairs.filter(card => {
        const name = card[1].name;

        /**
         * Full matches always get added, archetype matches only sometimes
         */
        if (namesRequired.includes(name)) {
            return true;
        } else if (
            namesRequired.some(archetype =>
                name.toLowerCase().includes(archetype.toLowerCase())
            )
        ) {
            return Math.random() < 0.5;
        }

        return false;
    });
    const mainPool = shuffledPairs.filter(card => {
        const name = card[1].name;

        if (requiredPool.includes(card)) {
            return false;
        }

        /**
         * Full matches always get added, archetype matches only sometimes
         */
        if (
            namesMain.some(archetype =>
                name.toLowerCase().includes(archetype.toLowerCase())
            )
        ) {
            return true;
        } else if (namesOptional.some(archetype => name.includes(archetype))) {
            return Math.random() < 0.5;
        }

        return Math.random() < randChance;
    });

    return { main: mainPool, required: requiredPool };
};

const RANDOMIZER_MODES = [
    {
        name: "Fully Random",
        splitter: shuffledPairs => {
            return { main: shuffledPairs, required: [] };
        }
    },
    {
        name: "One Archetype",
        splitter: shuffledPairs =>
            archetypeSplitterFactory(
                shuffledPairs,
                pickRandomArchetypes(1),
                0.005
            )
    },
    {
        name: "Two Archetypes",
        splitter: shuffledPairs =>
            archetypeSplitterFactory(
                shuffledPairs,
                pickRandomArchetypes(2),
                0.0025
            )
    },
    {
        name: "Three Archetypes",
        splitter: shuffledPairs =>
            archetypeSplitterFactory(
                shuffledPairs,
                pickRandomArchetypes(3),
                0.00125
            )
    }
];

Object.freeze(RANDOMIZER_MODES);

export { RANDOMIZER_MODES };
