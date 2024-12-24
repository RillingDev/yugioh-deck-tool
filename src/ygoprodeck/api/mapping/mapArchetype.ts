// https://jvilk.com/MakeTypes/
export interface RawArchetype {
	archetype_name: string;
}

export const mapArchetype = (archetype: RawArchetype): string =>
	archetype.archetype_name;
