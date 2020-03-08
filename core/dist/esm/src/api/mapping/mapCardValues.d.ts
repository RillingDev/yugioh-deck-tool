import { CardValues } from "../../core/model/CardValues";
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
declare const mapCardValues: (data: RawCardValues) => CardValues;
export { mapCardValues, RawCardValues };
