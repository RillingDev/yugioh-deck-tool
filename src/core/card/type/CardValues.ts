import type { CardTypeCategory } from "./CardTypeCategory";
import type { CardType } from "./CardType";

interface TypeCategoryValues {
	readonly subTypes: readonly string[];
	readonly types: readonly CardType[];
}

interface MonsterTypeCategoryValues extends TypeCategoryValues {
	readonly attributes: readonly string[];
	readonly levels: readonly number[];
	readonly linkMarkers: readonly string[];
}

export interface CardValues {
	readonly [CardTypeCategory.MONSTER]: MonsterTypeCategoryValues;
	readonly [CardTypeCategory.SPELL]: TypeCategoryValues;
	readonly [CardTypeCategory.TRAP]: TypeCategoryValues;
	readonly [CardTypeCategory.SKILL]: TypeCategoryValues;
}
