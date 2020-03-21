interface RawArchetype {
    archetype_name: string;
}

const mapArchetypes = (data: RawArchetype[]): string[] =>
    data.map(archetype => archetype.archetype_name);

export { mapArchetypes, RawArchetype };
