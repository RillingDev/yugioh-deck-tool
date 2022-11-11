import type { TypeCategoryValues } from "./TypeCategoryValues";

export interface MonsterTypeCategoryValues extends TypeCategoryValues {
	readonly attributes: ReadonlyArray<string>;
	readonly levels: ReadonlyArray<number>;
	readonly linkMarkers: ReadonlyArray<string>;
}
