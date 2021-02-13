import type { CardTypeCategory } from "./CardTypeCategory";
import type { MonsterTypeCategoryValues } from "./MonsterTypeCategoryValues";
import type { TypeCategoryValues } from "./TypeCategoryValues";

interface CardValues {
    readonly [CardTypeCategory.MONSTER]: MonsterTypeCategoryValues;
    readonly [CardTypeCategory.SPELL]: TypeCategoryValues;
    readonly [CardTypeCategory.TRAP]: TypeCategoryValues;
    readonly [CardTypeCategory.SKILL]: TypeCategoryValues;
}

export { CardValues };
