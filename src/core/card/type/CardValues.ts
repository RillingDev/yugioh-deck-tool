import type { CardTypeCategory } from "./CardTypeCategory";
import type { CardType } from "@/core/card/type/CardType";

interface TypeCategoryValues {
	readonly subTypes: ReadonlyArray<string>;
	readonly types: ReadonlyArray<CardType>;
}

interface MonsterTypeCategoryValues extends TypeCategoryValues {
	readonly attributes: ReadonlyArray<string>;
	readonly levels: ReadonlyArray<number>;
	readonly linkMarkers: ReadonlyArray<string>;
}

export interface CardValues {
	readonly [CardTypeCategory.MONSTER]: MonsterTypeCategoryValues;
	readonly [CardTypeCategory.SPELL]: TypeCategoryValues;
	readonly [CardTypeCategory.TRAP]: TypeCategoryValues;
	readonly [CardTypeCategory.SKILL]: TypeCategoryValues;
}
