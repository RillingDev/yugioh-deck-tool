/* eslint-disable @typescript-eslint/naming-convention */

import { CardValues } from "../../../core/card/type/CardValues";
import { CardTypeGroup } from "../../../core/card/type/CardTypeGroup";
import { CardType } from "../../../core/card/type/CardType";
import { DeckPart } from "../../../core/deck/DeckPart";
import { findByKey, requireNonNilElseThrow } from "lightdash";

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

const mapGroup = (type: RawCardType): CardTypeGroup =>
    requireNonNilElseThrow(
        findByKey<CardTypeGroup>(CardTypeGroup, type.group),
        () => new TypeError(`Unexpected type group '${type.group}'.`)
    );

const mapDeckPart = (type: RawCardType): Set<DeckPart> =>
    new Set(
        type.area.map((area) =>
            requireNonNilElseThrow(
                findByKey<DeckPart>(DeckPart, area),
                () => new TypeError(`Unexpected deck part '${area}'.`)
            )
        )
    );

const mapTypes = (typeNames: string[], types: CardType[]): CardType[] =>
    typeNames.map((typeName) =>
        requireNonNilElseThrow(
            types.find((type) => type.name === typeName),
            () => new TypeError(`Could not find type '${typeName}'.`)
        )
    );

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
        [CardTypeGroup.MONSTER]: {
            types: mapTypes(data.MONSTER.type, types),
            subTypes: data.MONSTER.race,
            attributes: data.MONSTER.attributes,
            levels: data.MONSTER.level,
            linkMarkers: data.MONSTER.linkmarkers,
        },
        [CardTypeGroup.SPELL]: {
            types: mapTypes(data.SPELL.type, types),
            subTypes: data.SPELL.race,
        },
        [CardTypeGroup.TRAP]: {
            types: mapTypes(data.TRAP.type, types),
            subTypes: data.TRAP.race,
        },
        [CardTypeGroup.SKILL]: {
            types: mapTypes(data.SKILL.type, types),
            subTypes: data.SKILL.race,
        },
    };
};

export { mapCardValues, RawCardValues };
