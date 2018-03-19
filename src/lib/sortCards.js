import {
    CARD_TYPE_SORTED,
    CARD_SPELL_TYPE,
    CARD_TRAP_TYPE
} from "./data/cards";

const compareType = (dataA, dataB) => {
    const typeA = dataA[1];
    const typeB = dataB[1];
    const typeComp =
        CARD_TYPE_SORTED.findIndex(typeArr => typeArr.includes(typeA)) -
        CARD_TYPE_SORTED.findIndex(typeArr => typeArr.includes(typeB));

    if (typeComp === 0) {
        if (typeA === "Spell Card") {
            return (
                CARD_SPELL_TYPE.indexOf(dataA.race) -
                CARD_SPELL_TYPE.indexOf(dataB.race)
            );
        } else if (typeA === "Trap Card") {
            return (
                CARD_TRAP_TYPE.indexOf(dataA.race) -
                CARD_TRAP_TYPE.indexOf(dataB.race)
            );
        }
    }

    return typeComp;
};

const sortCards = (list, cardDb) =>
    list.sort((a, b) => {
        const dataA = cardDb.get(a);
        const dataB = cardDb.get(b);
        const typeComp = compareType(dataA, dataB);
        const lvComp = Number(dataB.stats[2]) - Number(dataA.stats[2]);
        const nameComp = dataA.name.localeCompare(dataB.name);

        if (typeComp !== 0) {
            return typeComp;
        } else if (lvComp !== 0) {
            return lvComp;
        }

        return nameComp;
    });

export default sortCards;
