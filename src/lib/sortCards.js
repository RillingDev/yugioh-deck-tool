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
                CARD_SPELL_TYPE.indexOf(dataA[5]) -
                CARD_SPELL_TYPE.indexOf(dataB[5])
            );
        } else if (typeA === "Trap Card") {
            return (
                CARD_TRAP_TYPE.indexOf(dataA[5]) -
                CARD_TRAP_TYPE.indexOf(dataB[5])
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
        const lvComp = Number(dataB[4]) - Number(dataA[4]);
        const nameComp = dataA[0].localeCompare(dataB[0]);

        if (typeComp !== 0) {
            return typeComp;
        } else if (lvComp !== 0) {
            return lvComp;
        }

        return nameComp;
    });

export default sortCards;
