interface RawArchetype {
    archetype_name: string;
}

const mapArchetype = (archetype: RawArchetype): string =>
    archetype.archetype_name;

export { mapArchetype, RawArchetype };
