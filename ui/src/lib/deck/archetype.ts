import { ARCHETYPES } from "../data/archetypes";
import { shuffle, uniq } from "lodash";
import {
    CHANCE_ADD_OPTIONAL_CARD,
    CHANCE_ADD_REQUIRED_ARCHETYPE_CARD,
    getDefaultRatios
} from "../data/randomizer";

const arrFlattenDeep = arr => {
    const result = [];

    arr.forEach(val => {
        if (Array.isArray(val)) {
            result.push(...arrFlattenDeep(val));
        } else {
            result.push(val);
        }
    });

    return result;
};

const getRandomArchetypes = (max = 1) => shuffle(ARCHETYPES).slice(0, max);

const archetypePoolFactory = (pairsArr, archetypes, randChance) => {
    const namesMain = archetypes.map(archetype => archetype[0]);
    const namesRequired = uniq(
        arrFlattenDeep(archetypes.map(archetype => archetype[1]))
    );
    const namesOptional = uniq(
        arrFlattenDeep(archetypes.map(archetype => archetype[2]))
    );
    const requiredPool = pairsArr.filter(card => {
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
    const mainPool = pairsArr.filter(card => {
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

    return {
        main: mainPool,
        required: requiredPool,
        ratios: getDefaultRatios()
    };
};

export { getRandomArchetypes, archetypePoolFactory };
