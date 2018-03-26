import { ARCHETYPES } from "./data/archetypes";
import { arrUniq, randShuffle, arrFlattenDeep } from "lightdash";
import {
    RATIOS_DEFAULT,
    CHANCE_ADD_REQUIRED_ARCHETYPE_CARD,
    CHANCE_ADD_OPTIONAL_CARD
} from "./data/randomizer";

const getRandomArchetypes = (max = 1) => randShuffle(ARCHETYPES).slice(0, max);

const archetypePoolFactory = (shuffledPairs, archetypes, randChance) => {
    const namesMain = archetypes.map(archetype => archetype[0]);
    const namesRequired = arrUniq(
        arrFlattenDeep(archetypes.map(archetype => archetype[1]))
    );
    const namesOptional = arrUniq(
        arrFlattenDeep(archetypes.map(archetype => archetype[2]))
    );
    const requiredPool = shuffledPairs.filter(card => {
        const seed = Math.random();
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
            return seed < CHANCE_ADD_REQUIRED_ARCHETYPE_CARD;
        }

        return false;
    });
    const mainPool = shuffledPairs.filter(card => {
        const seed = Math.random();
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
            return seed < CHANCE_ADD_OPTIONAL_CARD;
        }

        return seed < randChance;
    });

    console.log({
        namesMain: namesMain.join(" + "),
        namesOptional,
        namesRequired
    });

    return {
        main: mainPool,
        required: requiredPool,
        ratios: RATIOS_DEFAULT
    };
};

export { getRandomArchetypes, archetypePoolFactory };
