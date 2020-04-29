import { GroupValues } from "./GroupValues";

interface MonsterGroupValues extends GroupValues {
    readonly attributes: string[];
    readonly levels: number[];
    readonly linkMarkers: string[];
}

export { MonsterGroupValues };
