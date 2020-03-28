import { CardTypeGroup } from "./CardTypeGroup";
import { MonsterGroupValues } from "./MonsterGroupValues";
import { GroupValues } from "./GroupValues";

interface CardValues {
    readonly [CardTypeGroup.MONSTER]: MonsterGroupValues;
    readonly [CardTypeGroup.SPELL]: GroupValues;
    readonly [CardTypeGroup.TRAP]: GroupValues;
    readonly [CardTypeGroup.SKILL]: GroupValues;
}

export { CardValues };
