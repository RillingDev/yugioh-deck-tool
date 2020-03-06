import { CardValues } from "../../core/model/types/CardValues";
interface RawCardValues {
    types: RawCardType[];
    MONSTER: RawMonsterGroupValues;
    SPELL: GroupValues;
    TRAP: GroupValues;
    SKILL: GroupValues;
}
interface RawCardType {
    name: string;
    group: "MONSTER" | "SPELL" | "TRAP" | "SKILL";
    sortGroup: number;
    area: Array<"MAIN" | "EXTRA" | "SIDE">;
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
