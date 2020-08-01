import { CardTypeCategory } from "./CardTypeCategory";
import { MonsterTypeCategoryValues } from "./MonsterTypeCategoryValues";
import { TypeCategoryValues } from "./TypeCategoryValues";

interface CardValues {
    readonly [CardTypeCategory.MONSTER]: MonsterTypeCategoryValues;
    readonly [CardTypeCategory.SPELL]: TypeCategoryValues;
    readonly [CardTypeCategory.TRAP]: TypeCategoryValues;
    readonly [CardTypeCategory.SKILL]: TypeCategoryValues;
}

export { CardValues };
