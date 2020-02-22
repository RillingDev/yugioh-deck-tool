import {
    CARD_SPELL_TYPE,
    CARD_TRAP_TYPE,
    CARD_TYPE_SORTED
} from "../data/cards";

const compareType = (dataA, dataB) => {
    const typeComp =
        CARD_TYPE_SORTED.findIndex(typeArr => typeArr.includes(dataA.type)) -
        CARD_TYPE_SORTED.findIndex(typeArr => typeArr.includes(dataB.type));

    if (typeComp === 0) {
        if (dataA.type === "Spell Card") {
            return (
                CARD_SPELL_TYPE.indexOf(dataA.race) -
                CARD_SPELL_TYPE.indexOf(dataB.race)
            );
        } else if (dataB.type === "Trap Card") {
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
