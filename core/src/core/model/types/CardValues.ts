import { CardTypeGroup } from "./CardTypeGroup";
import { CardType } from "./CardType";
import { MonsterGroupValues } from "./MonsterGroupValues";
import { GroupValues } from "./GroupValues";

interface CardValues {
    types: CardType[];
    values: {
        [CardTypeGroup.MONSTER]: MonsterGroupValues;
        [CardTypeGroup.SPELL]: GroupValues;
        [CardTypeGroup.TRAP]: GroupValues;
        [CardTypeGroup.SKILL]: GroupValues;
    };
}

export { CardValues };
