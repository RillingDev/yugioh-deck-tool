import type { TypeCategoryValues } from "./TypeCategoryValues";

interface MonsterTypeCategoryValues extends TypeCategoryValues {
    readonly attributes: string[];
    readonly levels: number[];
    readonly linkMarkers: string[];
}

export { MonsterTypeCategoryValues };
