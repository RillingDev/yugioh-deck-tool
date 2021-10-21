import type { TypeCategoryValues } from "./TypeCategoryValues";

export interface MonsterTypeCategoryValues extends TypeCategoryValues {
	readonly attributes: string[];
	readonly levels: number[];
	readonly linkMarkers: string[];
}
