import { CardValues } from "../../core/model/ygo/CardValues";
import { CardTypeGroup } from "../../core/model/ygo/CardTypeGroup";
import { DeckPart, DefaultDeckPart } from "../../core/model/ygo/DeckPart";
import { CardType } from "../../core/model/ygo/CardType";

// https://jvilk.com/MakeTypes/
interface RawCardValues {
    types: RawCardType[];
    MONSTER: RawMonsterGroupValues;
    SPELL: GroupValues;
    TRAP: GroupValues;
    SKILL: GroupValues;
}

interface RawCardType {
    name: string;
    group: string;
    sortGroup: number;
    area: string[];
}

interface RawMonsterGroupValues {
    type: string[];
    race: string[];
    attributes: string[];
    level: number[];
    linkmarkers: string[];
}

interface GroupValues {
    type: string[];
    race: string[];
}

const mapGroup = (type: RawCardType): CardTypeGroup => {
    if (type.group === "SKILL") {
        return CardTypeGroup.SKILL;
    }
    if (type.group === "SPELL") {
        return CardTypeGroup.SPELL;
    }
    if (type.group === "TRAP") {
        return CardTypeGroup.TRAP;
    }
    if (type.group === "MONSTER") {
        return CardTypeGroup.MONSTER;
    }
    throw new TypeError(`Unexpected group '${type.group}'.`);
};

const mapDeckPart = (type: RawCardType): Set<DeckPart> =>
    new Set(
        type.area.map((area) => {
            if (area === "SIDE") {
                return DefaultDeckPart.SIDE;
            }
            if (area === "EXTRA") {
                return DefaultDeckPart.EXTRA;
            }
            if (area === "MAIN") {
                return DefaultDeckPart.MAIN;
            }
            throw new TypeError(`Unexpected deck part type '${area}'.`);
        })
    );

const mapTypes = (typeNames: string[], types: CardType[]): CardType[] =>
    typeNames.map((typeName) => {
        const matchingType = types.find((type) => type.name === typeName);

        if (matchingType == null) {
            throw new TypeError(`Could not find type '${typeName}'.`);
        }
        return matchingType;
    });

const mapCardValues = (data: RawCardValues): CardValues => {
    const types: CardType[] = data.types.map((type) => {
        return {
            name: type.name,
            group: mapGroup(type),
            sortGroup: type.sortGroup,
            deckParts: mapDeckPart(type),
        };
    });
    return {
        types,
        [CardTypeGroup.MONSTER]: {
            types: mapTypes(data.MONSTER.type, types),
            races: data.MONSTER.race,
            attributes: data.MONSTER.attributes,
            levels: data.MONSTER.level,
            linkMarkers: data.MONSTER.linkmarkers,
        },
        [CardTypeGroup.SPELL]: {
            types: mapTypes(data.SPELL.type, types),
            races: data.SPELL.race,
        },
        [CardTypeGroup.TRAP]: {
            types: mapTypes(data.TRAP.type, types),
            races: data.TRAP.race,
        },
        [CardTypeGroup.SKILL]: {
            types: mapTypes(data.SKILL.type, types),
            races: data.SKILL.race,
        },
    };
};

export { mapCardValues, RawCardValues };
